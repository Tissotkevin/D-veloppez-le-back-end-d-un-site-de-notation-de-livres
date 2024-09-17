const Book = require('../models/book');

const verifyBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json('essaie encore');
    }
    req.book = book;
    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = verifyBook;