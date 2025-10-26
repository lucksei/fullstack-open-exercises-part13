const router = require('express').Router();
const { User, Blog } = require('../models');
const { NotFoundError } = require('../util/errors');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
    },
  });
  if (!req.user) {
    throw new NotFoundError('Error, user not found')
  }
  next();
};

router.get('/:id', userFinder, async (req, res) => {
  return res.status(200).json(req.user);
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (!user) {
    throw new NotFoundError('Error, user not found')
  }
  await user.update({ username: req.body.username })
  return res.status(200).json(user)
})
module.exports = router