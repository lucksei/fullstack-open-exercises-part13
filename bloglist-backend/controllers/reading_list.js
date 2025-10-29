const router = require('express').Router();
const { ReadingList } = require('../models');

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body;

  const readingList = await ReadingList.create({
    user_id: userId,
    blog_id: blogId,
  }, { returning: true });

  return res.status(201).json(readingList);
});

module.exports = router;