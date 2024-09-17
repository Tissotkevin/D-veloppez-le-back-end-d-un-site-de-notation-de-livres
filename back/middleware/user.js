const User = require('../models/user');

const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json('essaie encore');
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = verifyUser;