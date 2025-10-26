const router = require('express').Router()
const { NotFoundError } = require('../util/errors')
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middlewares')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({})
  return res.status(200).json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id }, { returning: true })
  return res.status(201).json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    throw new NotFoundError('Error, blog not found')
  }
  next()
}

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  return res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  await req.blog.update({ likes: req.body.likes })
  return res.status(200).json(req.blog)
})

module.exports = router