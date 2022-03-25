const { validateUserSignup, validateUserSignin } = require('../utils/validator');
const generateRandomKey = require('../utils/generate_random_key');
const { User } = require('../config/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

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
            name: req.body.name,
            email: req.body.email
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

const forgetPassword = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    if(user) {
        const token = generateRandomKey();
        user.update({
            password_token: token,
            password_token_created_at: moment().format()
        })
        .then(() => {
            res.json({
                success: true
            });
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: "Email is not registered."
        });
    }
}

const resetPassword = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email,
            password_token: req.body.token
        }
    });

    if(user && user.password_token) {
        const password_hash = await bcrypt.hash(req.body.password, 10);
        user.update({
            password: password_hash,
            password_token: null,
            password_token_created_at: null
        })
        .then(() => {
            res.json({
                success: true
            });
        });
    }
    else {
        res.status(404).json({
            success: false,
            message: "Reset link is invalid."
        })
    }
}

const verifyEmail = async (req, res) => {

}

const me = (req, res) => {
    res.json(req.user);
}

module.exports = {
    signIn,
    signUp,
    forgetPassword,
    resetPassword,
    verifyEmail,
    me
}