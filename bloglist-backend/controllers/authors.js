const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db');
const { authValidation } = require('../util/middlewares');

router.get('/', authValidation, async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ]
  });
  return res.json(authors)
});

module.exports = router