const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { NotFoundError, UnauthorizedError } = require('../util/errors')
const { authValidation } = require('../util/middlewares')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = {
      title: { [Op.iLike]: `%${req.query.search}%` },
      author: { [Op.iLike]: `%${req.query.search}%` },
    }
    // NOTE: The following line was replaced for exercise 13.14 above
    // where.title = { [Op.iLike]: `%${req.query.search}%` }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
    },
    attributes: { exclude: ['userId'] },
    where,
    order: [['likes', 'DESC']],
  });

  return res.status(200).json(blogs)
})

router.post('/', authValidation, async (req, res) => {
  const user = await User.findByPk(req.session.userId)
  const blog = await Blog.create({ ...req.body, userId: user.id }, { returning: true })
  return res.status(201).json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    include: {
      model: User,
    },
    attributes: { exclude: ['userId'] },
  });
  if (!req.blog) {
    throw new NotFoundError('Error, blog not found')
  }
  next()
}

router.delete('/:id', authValidation, blogFinder, async (req, res) => {
  if (req.blog.userId !== req.session.userId) {
    throw new UnauthorizedError('Error, blog is not owned by user')
  }
  await req.blog.destroy();
  return res.status(204).end();
})

router.put('/:id', blogFinder, async (req, res) => {
  await req.blog.update({ likes: req.body.likes })
  return res.status(200).json(req.blog)
})

module.exports = router