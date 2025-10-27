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
  if (req.params.id) {
    req.user = await User.findByPk(req.params.id, {
      include: { model: Blog, },
    });
  }
  if (req.params.username) {
    req.user = await User.findOne({
      where: { username: req.params.username },
      include: { model: Blog, },
    })
  }
  if (!req.user) {
    throw new NotFoundError('Error, user not found')
  }
  next();
};

router.get('/:id', userFinder, async (req, res) => {
  return res.status(200).json(req.user);
})

// NOTE: From the material, delete later
// const isAdmin = async (req, res, next) => {
//   const user = await User.findByPk(req.decodedToken.id);
//   if (!user.admin) {
//     throw new UnauthorizedError('Error, user is not admin')
//   }
//   next()
// }

router.put('/:username', userFinder, async (req, res) => {
  await req.user.update({
    username: req.body.username,
  })
  return res.status(200).json(req.user)
})

module.exports = router
