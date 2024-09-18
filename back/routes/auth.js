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
        console.error(err);
        res.status(500).json('Une erreur est survenue, veuillez réessayer.');
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        // Vérifiez que les champs requis sont fournis
        if (!req.body.email || !req.body.password) {
            return res.status(400).json('Le nom d’utilisateur et le mot de passe sont requis.');
        }

        // Recherchez l'utilisateur par nom d'utilisateur
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json('Nom d’utilisateur ou mot de passe incorrect.');
        }

        // Comparez le mot de passe fourni avec le mot de passe hashé dans la base de données
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json('Nom d’utilisateur ou mot de passe incorrect.');
        }

        // Génération du token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SEC, { expiresIn: '3h' });

        // Réponse avec les détails de l’utilisateur et le token
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token
        });
    } catch (err) {
        // Log de l'erreur pour le débogage
        console.error(err);
        // Réponse d'erreur générique
        res.status(500).json('Une erreur est survenue, veuillez réessayer.');
    }
});


module.exports = router;
