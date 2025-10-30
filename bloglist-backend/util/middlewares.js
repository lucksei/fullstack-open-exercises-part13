const jwt = require('jsonwebtoken');
const { NotFoundError, UnauthorizedError } = require("./errors");
const { ValidationError } = require('sequelize')

const { SECRET, SESSION_TIMEOUT } = require('../util/config');
const { Session } = require('../models');

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

const authValidation = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    throw new UnauthorizedError('token missing')
  }

  const token = authorization.substring(7);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch (err) {
    throw new UnauthorizedError('token invalid');
  }

  const session = await Session.findOne({ where: { userId: decodedToken.id } })

  if (!session || session.token !== token || session.updatedAt < Date.now() - SESSION_TIMEOUT) {
    throw new UnauthorizedError('token invalid or expired')
  }
  req.session = session
  next()
}

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: `unknown endpoint ${req.method} ${req.url}` })
}

module.exports = {
  errorHandler,
  authValidation,
  unknownEndpoint,
}