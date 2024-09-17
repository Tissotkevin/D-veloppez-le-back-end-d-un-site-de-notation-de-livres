require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const bookRoute = require('./routes/book');
const multer = require('multer');
const path = require('path');

const app = express();
dotenv.config();
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '/images')));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log('Connected to MongoDB'))
.catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

// cette partie n'est pas attendu pour ton frontend elle a été déplacée dans la route book
const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json('File has been uploaded');
});

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/books', bookRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log('Backend is running');
});