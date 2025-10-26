const jwt = require('jsonwebtoken');
const { NotFoundError, UnauthorizedError } = require("./errors");
const { ValidationError } = require('sequelize')

const { SECRET } = require('../util/config');

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message })
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message })
  }

  return res.status(500).json({ error: err.message })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (err) {
      throw new UnauthorizedError('token invalid');
    }
  } else {
    throw new UnauthorizedError('token missing')
  }
  next()
}

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: `unknown endpoint ${req.method} ${req.url}` })
}

module.exports = {
  errorHandler,
  tokenExtractor,
  unknownEndpoint,
}