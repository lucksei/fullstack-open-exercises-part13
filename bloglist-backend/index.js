// Express
const express = require('express')
// Controllers
const blogsRouter = require('./controllers/blogs')
// Middleware
const { errorHandler } = require('./util/middlewares')
// Utils
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const app = express()
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
