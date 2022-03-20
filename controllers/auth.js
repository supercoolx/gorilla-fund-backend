const { validateUserSignup, validateUserSignin } = require('../utils/validator');
const { User } = require('../config/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signIn = async (req, res) => {
    const { isValid, errors } = validateUserSignin(req.body);
    if(!isValid) return res.status(422).json(errors);

    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    if(!user) {
        return res.status(401).json({
            success: false,
            message: "Unregistered email."
        });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch) {
        return res.status(403).json({
            success: false,
            message: "Password is incorrect."
        });
    }

    jwt.sign(
        {
            name: user.name,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        },
        (err, token) => {
            res.json({
                success: true,
                token: 'Bearer ' + token
            });
        }
    );
}

const signUp = async (req, res) => {
    const { isValid, errors } = validateUserSignup(req.body);
    if(!isValid) return res.status(422).json(errors);

    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    if(user) {
        return res.status(409).json({
            success: false,
            message: "Email is already in use."
        });
    }

    const password_hash = await bcrypt.hash(req.body.password, 10);
    await User.create({
        name: req.body.name,
        email: req.body.email,
        password: password_hash,
    });

    jwt.sign(
        {
            name: user.name,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        },
        (err, token) => {
            res.json({
                success: true,
                token: 'Bearer ' + token
            });
        }
    );
}

const me = (req, res) => {
    res.json(req.user);
}

module.exports = {
    signIn,
    signUp,
    me
}