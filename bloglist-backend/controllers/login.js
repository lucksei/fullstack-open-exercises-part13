const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { User, Session } = require('../models');

const { SECRET } = require('../util/config');

router.post('/login', async (req, res) => {

  const user = await User.findOne({
    where: {
      username: req.body.username
    }
  })

  if (!(user)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'user is disabled'
    });
  }

  const passwordCorrect = req.body.password === 'secret';
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  };

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);



  return res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

router.delete('/logout', (req, res) => {
  return res.status(404).json({ error: 'not implemented' });
});

module.exports = router;