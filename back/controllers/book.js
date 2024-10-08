const Book = require('../models/book');

//GET ALL BOOKS
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json(err);
    }
};

//GET BOOK BY ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json(err);
    }
};

//CREATE BOOK
exports.createBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        userId: req.auth.userId,
        imageUrl `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(500).json(err);
    }
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};



//UPDATE BOOK
exports.updateBook = async (req, res) => {
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
};

//DELETE BOOK
exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json('livre supprimé');
    } catch (err) {
        res.status(500).json(err);
    }
};