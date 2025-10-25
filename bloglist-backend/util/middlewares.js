const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  return res.status(500).json({ error: err.message })
}

module.exports = {
  errorHandler
}