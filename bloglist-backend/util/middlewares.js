const { NotFoundError } = require("./errors");
const { ValidationError } = require('sequelize')

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message })
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }

  return res.status(500).json({ error: err.message })
}

module.exports = {
  errorHandler
}