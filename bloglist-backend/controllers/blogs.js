const router = require('express').Router()
const { Blog } = require('../models')


router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({})
  return res.json(blogs)
})

router.post('/', async (req, res) => {
  console.log(req.body)
  const blog = await Blog.create(req.body, { returning: true })
  return res.status(201).json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end()
  }
  await res.blog.destroy()
  return res.status(204).end()
})

module.exports = router