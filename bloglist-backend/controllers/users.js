const router = require('express').Router();
const { User } = require('../models');
const { NotFoundError } = require('../util/errors');

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id);
  if (!req.user) {
    throw new NotFoundError('Error, user not found')
  }
  next();
};

router.get('/:id', userFinder, async (req, res) => {
  return res.status(200).json(req.user);
})

module.exports = router