const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const handlebars = require('handlebars');
const { bufferToHex } = require('ethereumjs-util');
const { recoverPersonalSignature } = require('eth-sig-util');
const mail = require('../service/mail');
const user = require('../db/models/user');
const config = require('../config/config');
const onError = require('../utils/error');
const { User } = require('../config/sequelize');
const { validateUserSignup, validateUserSignin } = require('../utils/validator');
const { generateRandomKey, generateRandomNumber } = require('../utils/generate_random');

const signIn = async (req, res) => {
    const { isValid, errors } = validateUserSignin(req.body);
    if(!isValid) return res.status(422).json(errors);

    const user = await User.findOne({ where: { email: req.body.email } });

    if(!user) return res.status(401).json({
        success: false,
        message: "Unregistered email."
    });

    if(user.deleted) return res.status(403).json({
        success: false,
        message: "This account has been closed."
    });

    const isMatch = await bcrypt.compare(req.body.password, user.password || "");
    if(!isMatch) {
        return res.status(403).json({
            success: false,
            message: "Password is incorrect."
        });
    }

    jwt.sign( 
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION },
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

    let user = await User.findOne({ where: { username: req.body.username } });
    if(user) {
        return res.status(409).json({
            success: false,
            message: "Username is already in use."
        });
    }
    user = await User.findOne({ where: { email: req.body.email } });
    if(user) {
        return res.status(409).json({
            success: false,
            message: "Email is already in use."
        });
    }

    const password_hash = await bcrypt.hash(req.body.password, 10);
    const hash = md5(req.body.email);
    const email_verify_code = generateRandomNumber();
    await User.create({
        username: req.body.username,
        email: req.body.email,
        emailToken: email_verify_code,
        emailTokenCreateAt: moment().format(),
        avatar: `https://avatars.dicebear.com/api/identicon/${hash}.svg`,
        password: password_hash,
    });

    const template_source = fs.readFileSync(path.join(__dirname, '..', 'template', 'mail', 'email_verify.hbs'), 'utf-8');
    const template = handlebars.compile(template_source);
    const html = template({ code: email_verify_code });
    mail.sendMail({
        from: process.env.MAIL_USER,
        to: req.body.email,
        subject: 'Verify your email address',
        html: html
    })
    .then(info => console.log(info))
    .catch(err => console.log(err.message));

    jwt.sign( 
        { email: req.body.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION },
        (err, token) => {
            res.json({
                success: true,
                token: 'Bearer ' + token
            });
        }
    );
}

const forgetPassword = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });

    if(user) {
        const token = generateRandomKey();
        const reset_link = `${process.env.APP_URL}/reset/${req.body.email}/${token}`;

        const template_source = fs.readFileSync(path.join(__dirname, '..', 'template', 'mail', 'reset_password.hbs'), 'utf-8');
        const template = handlebars.compile(template_source);
        const html = template({ link: reset_link });
        mail.sendMail({
            from: process.env.MAIL_USER,
            to: req.body.email,
            subject: 'Reset your password',
            html: html
        })
        .then(info => console.log(info))
        .catch(err => console.log(err.message));

        user.update({
            passwordToken: token,
            passwordTokenCreatedAt: moment().format()
        })
        .then(() => res.json({ success: true }))
        .catch(err => onError(err, res));
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
    const email_verify_code = generateRandomNumber();

    const template_source = fs.readFileSync(path.join(__dirname, '..', 'template', 'mail', 'email_verify.hbs'), 'utf-8');
    const template = handlebars.compile(template_source);
    const html = template({ code: email_verify_code });
    mail.sendMail({
        from: process.env.MAIL_USER,
        to: req.user.email,
        subject: 'Verify your email address',
        html: html
    })
    .then(info => console.log(info))
    .catch(err => console.log(err.message));

    req.user.update({
        emailToken: email_verify_code,
        emailTokenCreateAt: moment().format()
    })
    .then(() => res.json({ success: true }))
    .catch(err => onError(err, res));
}

const verifyEmail = async (req, res) => {
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
    const { walletAddress } = req.body;
    User.findOne({
        where: { walletAddress }
    })
    .then(user => {
        let randomkey = generateRandomKey();
        if(user) {
            if(user.deleted) return res.status(403).json({
                success: false,
                message: "Your account has been closed"
            });
            user.metamaskToken = randomkey;
            user.save().then(() => res.json({randomkey, walletAddress}));
        }
        else {
            const hash = md5(walletAddress);
            User.create({
                walletAddress,
                metamaskToken: randomkey,
                avatar: `https://avatars.dicebear.com/api/identicon/${hash}.svg`,
            })
            .then(() => res.json({randomkey, walletAddress}));
        }
    })
    .catch(err => onError(err, res));
}

const signinMetamask = async (req, res) => {
    const { walletAddress, signature } = req.body;
    const user = await User.findOne({ where: { walletAddress } });
    if(!user) return res.status(404).json({
        success: false,
        message: "Your wallet is not registered"
    });
    if(user.deleted) return res.status(403).json({
        success: false,
        message: "Your account has been closed"
    });
    const msg = `Please sign the message to authenticate.\ntoken: ${user.metamaskToken}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const recoverAddress = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature
    });
    if(walletAddress.toLowerCase() === recoverAddress.toLowerCase()) {
        jwt.sign(
            { walletAddress },
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

const changePassword = (req, res) => {
    const { current, newPass } = req.body;
    if(newPass.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters."
        })
    }
    if(current === "" && req.user.password === null) {
        bcrypt.hash(newPass, 10)
        .then(hashed => req.user.update({ password: hashed }))
        .then(r => res.json({ success: true }))
        .catch(err => onError(err, res));
    }
    else {
        bcrypt.compare(current, req.user.password || "")
        .then(isMatch => {
            if(!isMatch) {
                throw new Error("Password is incorrect.");
            }
            else return bcrypt.hash(newPass, 10);
        })
        .then(hashed => req.user.update({ password: hashed }))
        .then(r => res.json({ success: true }))
        .catch(err => onError(err, res));
    }
}

const deleteAccount = (req, res) => {
    req.user.update({ deleted: true })
    .then(() => res.json({ success: true }))
    .catch(err => onError(err, res));
}

const me = (req, res) => {
    const user = {
        loggedIn: true,
        username: req.user.username,
        email: req.user.email,
        emailSetting: req.user.emailSetting,
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        country: JSON.parse(req.user.country),
        phone: req.user.phone,
        zipCode: req.user.zipCode,
        city: req.user.city,
        address: req.user.address,
        identifyType: req.user.identifyType,
        identifyNumber: req.user.identifyNumber,
        identifyExpire: req.user.identifyExpire,
        document1: req.user.document1,
        document2: req.user.document2,
        walletAddress: req.user.walletAddress,
    }
    res.json(user);
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
    changePassword,
    deleteAccount,
    me
}