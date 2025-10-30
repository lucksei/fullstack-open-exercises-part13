const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { User, Session } = require('../models');
const { NotFoundError } = require('../util/errors');
const { authValidation } = require('../util/middlewares');

const { SECRET } = require('../util/config');

router.post('/login', async (req, res) => {

  const user = await User.findOne({
    where: {
      username: req.body.username
    }
  })


  // If password is incorrect
  const passwordCorrect = req.body.password === 'secret';
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  };

  // If user is disabled
  if (user.disabled) {
    return res.status(401).json({
      error: 'user is disabled'
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userForToken, SECRET);

  // Create session or update if exists
  await Session.upsert({
    userId: user.id,
    token: token
  })

  return res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

router.delete('/logout', authValidation, async (req, res) => {
  await req.session.destroy()
  return res.status(200).end();
});

// NOTE: Get all sessions, for testing only TODO delete
router.get('/sessions', async (req, res) => {
  const sessions = await Session.findAll()
  return res.status(200).json(sessions)
})

module.exports = router;