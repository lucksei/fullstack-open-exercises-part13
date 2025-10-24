require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')

// Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model { }
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog',
})

// Express
const app = express()
app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll({})
  return res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  console.log(req.body)
  const blog = await Blog.create(req.body, { returning: true })
  return res.status(201).json(blog)
})

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Blog.destroy({ where: { id } })
  } catch (error) {
    console.log(error)
  }
  return res.status(204).end()
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
