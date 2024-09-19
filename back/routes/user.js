const router = require('express').Router();
const User = require('../models/user');
const verifyToken = require('../middleware/auth');
const verifyUser = require('../middleware/user');

//GET ALL USERS
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER BY ID
router.get('/:id', verifyToken, verifyUser, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE USER
router.put('/:id', verifyToken, verifyUser, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE USER
router.delete('/:id', verifyToken, verifyUser, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('user suprimé');
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;