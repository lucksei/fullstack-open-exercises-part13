const router = require('express').Router();
const { ReadingList } = require('../models');
const { NotFoundError } = require('../util/errors');

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body;

  const readingList = await ReadingList.create({
    user_id: userId,
    blog_id: blogId,
  }, { returning: true });

  return res.status(201).json(readingList);
});

const readingListFinder = async (req, res, next) => {
  req.readingList = await ReadingList.findByPk(req.params.id);
  if (!req.readingList) {
    throw new NotFoundError('Error, reading list not found')
  }
  next();
}

router.put('/:id', readingListFinder, async (req, res) => {
  await req.readingList.update({
    read: req.body.read
  });
  return res.status(200).json(req.readingList)
})

module.exports = router;