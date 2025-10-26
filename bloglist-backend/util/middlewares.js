const jwt = require('jsonwebtoken');
const { NotFoundError } = require("./errors");
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

  return res.status(500).json({ error: err.message })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
}