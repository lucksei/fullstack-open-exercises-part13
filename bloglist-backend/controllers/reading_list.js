const router = require('express').Router();
const { ReadingList } = require('../models');

router.post('/', async (req, res) => {
  return res.status(403).json({ "error": "not implemented" })
});

module.exports = router;