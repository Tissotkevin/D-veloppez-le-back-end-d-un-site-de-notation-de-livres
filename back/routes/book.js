const router = require('express').Router();
const Book = require('../models/book');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    // filename: (req, file, cb) => {
    //     const form = JSON.parse(req.body.book);
    //     cb(null, form.title);
    // },
});

const upload = multer({ storage: storage });
router.post('/', upload.array("image"), async (req, res) => {
    try {
        const form = JSON.parse(req.body.book);
        const newBook = new Book(form);
        const savedBook = await newBook.save();
        res.status(200).json(savedBook);
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL BOOKS
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET BOOK BY ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE BOOK
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json('livre suprimé');
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;