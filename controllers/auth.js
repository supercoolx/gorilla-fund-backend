const { validateUserSignup, validateUserSignin } = require('../utils/validator');
const { generateRandomKey, generateRandomNumber } = require('../utils/generate_random');
const { User } = require('../config/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const md5 = require('md5');
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const user = require('../db/models/user');
const config = require('../config/config');

const signIn = async (req, res) => {
    const { isValid, errors } = validateUserSignin(req.body);
    if(!isValid) return res.status(422).json(errors);

    const user = await User.findOne({
        where: {
            email: req.body.email,
            deleted: 0
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
    const hash = md5(req.body.email);
    await User.create({
        name: req.body.name,
        email: req.body.email,
        emailToken: generateRandomNumber(),
        emailTokenCreateAt: moment().format(),
        avatar: `https://avatars.dicebear.com/api/identicon/${hash}.svg`,
        password: password_hash,
    });

    jwt.sign(
        {
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
            passwordToken: token,
            passwordTokenCreatedAt: moment().format()
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
            passwordToken: req.body.token
        }
    });

    if(user && user.passwordToken) {
        const password_hash = await bcrypt.hash(req.body.password, 10);
        user.update({
            password: password_hash,
            passwordToken: null,
            passwordTokenCreatedAt: null
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

const verifyResetLink = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email,
            passwordToken: req.body.token
        }
    })
    .then(user => {
        if(user) res.json({ success: true });
        else res.status(404).json({ success: false });
    });
}

const setVerifyEmail = (req, res) => {
    req.user.update({
        emailToken: generateRandomNumber(),
        emailTokenCreateAt: moment().format()
    }).then(() => {
        res.json({
            success: true
        });
    });
}

const verifyEmail = (req, res) => {
    if(!(req.body.token && req.user.emailToken === req.body.token)) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
    
    const isExpired = moment().isAfter(moment(user.emailTokenCreateAt).add(config.EMAIL_VERIFY_EXPIRE_TIME, 'd'));
    if(isExpired) {
        return res.status(410).json({
            success: false,
            message: "This link is expired."
        });
    }

    const current = moment().format();

    req.user.update({
        emailToken: null,
        emailTokenCreateAt: null,
        emailVerifiedAt: current
    }).then(() => {
        res.json({
            success: true,
            emailVerifiedAt: current
        });
    });
}

const getMetamaskToken = (req, res) => {
    const { address } = req.body;
    User.findOne({
        where: { address: address }
    })
    .then(user => {
        let randomkey = generateRandomKey();
        if(user) {
            user.metamaskToken = randomkey;
            user.save().then(() => res.json({randomkey, address}));
        }
        else {
            const hash = md5(address);
            User.create({
                address: address,
                metamaskToken: randomkey,
                avatar: `https://avatars.dicebear.com/api/identicon/${hash}.svg`,
            })
            .then(() => res.json({randomkey, address}));
        }
    })
    .catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

const signinMetamask = async (req, res) => {
    const { address, signature } = req.body;
    const user = await User.findOne({ where: { address: address } });
    if(!user) return res.status(404).json({
        success: false,
        message: "Your wallet is not registered"
    });
    const msg = `Please sign the message to authenticate.\ntoken: ${user.metamaskToken}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const recoverAddress = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature
    });
    if(address.toLowerCase() === recoverAddress.toLowerCase()) {
        jwt.sign(
            { address },
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
    else {
        return res.status(401).json({
            success: false,
            message: "Signature verification failed"
        });
    }
}

const me = (req, res) => {
    res.json(req.user);
}

module.exports = {
    signIn,
    signUp,
    forgetPassword,
    resetPassword,
    verifyResetLink,
    setVerifyEmail,
    verifyEmail,
    getMetamaskToken,
    signinMetamask,
    me
}