const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/signup', async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(404).json('essaie encore');
        if(user == null) {
            return res.status(404);
        }
        console.log(req.body, user);
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json('essaie encore');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SEC, { expiresIn: '3h' });
        res.status(200).json({ user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }, token });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;