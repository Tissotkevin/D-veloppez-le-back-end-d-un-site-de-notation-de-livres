const router = require('express').Router();
const Book = require('../models/book');
const verifyToken = require('../middleware/auth');
const verifyBook = require('../middleware/book');
const multer = require('../middleware/multer-config');

//CREATE BOOK
router.post('/', verifyToken, multer, async (req, res) => {
    const newBook = new Book({
        userId: req.user.id,
        title: req.body.title,
        author: req.body.author,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    try {
        const savedBook = await newBook.save();
        res.status(200).json(savedBook);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE BOOK
router.put('/:id', verifyToken, verifyBook, multer, async (req, res) => {
    if (req.file) {
        // If a new image is uploaded, update the imageUrl
        req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE BOOK
router.delete('/:id', verifyToken, verifyBook, async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json('livre supprimé');
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET BOOK
router.get('/:id', verifyToken, verifyBook, async (req, res) => {
    try {
        res.status(200).json(req.book);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL BOOKs
router.get('/', verifyToken, async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
