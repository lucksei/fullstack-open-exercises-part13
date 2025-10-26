const { NotFoundError } = require("./errors");

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  return res.status(500).json({ error: err.message })
}

module.exports = {
  errorHandler
}