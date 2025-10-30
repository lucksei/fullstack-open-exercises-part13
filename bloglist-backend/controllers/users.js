const router = require('express').Router();
const { where, Op } = require('sequelize');
const { User, Blog, ReadingList } = require('../models');
const { NotFoundError } = require('../util/errors');
const { authValidation } = require('../util/middlewares');


router.get('/', authValidation, async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: { attributes: ['id', 'read'] },
      }
    ]
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

const userFinder = async (req, res, next) => {
  const whereRead = {};

  if (req.query.read) {
    whereRead.read = {
      [Op.eq]: req.query.read
    }
  }
  if (req.params.id) {
    req.user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
          through: { attributes: ['id', 'read'], where: whereRead },
        }
      ],
    });
  }
  if (req.params.username) {
    req.user = await User.findOne({
      where: { username: req.params.username },
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
          through: { attributes: ['id', 'read'], where: whereRead },
        }
      ]
    })
  }
  if (!req.user) {
    throw new NotFoundError('Error, user not found')
  }
  next();
};

router.get('/:id', authValidation, userFinder, async (req, res) => {
  return res.status(200).json(req.user);
})

router.get('/username/:username', authValidation, userFinder, async (req, res) => {
  return res.status(200).json(req.user);
})


router.put('/:username', authValidation, userFinder, async (req, res) => {
  await req.user.update({
    username: req.body.username,
    disabled: req.body.disabled
  })
  return res.status(200).json(req.user)
})

module.exports = router
