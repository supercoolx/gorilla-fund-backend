const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { literal } = require('sequelize');
const onError = require('../utils/error');
const { Admin, Fund, Donate, User } = require('../config/sequelize');

const login = (req, res) => {
    const { email, password } = req.body;
    if(!email.trim() || !password.trim()) return res.status(422).json({
        success: false,
        message: "Invalid inputs"
    });

    Admin.findOne({ where: { email } })
    .then(admin => [bcrypt.compare(password, admin?.password || ""), admin])
    .then(([isMatch, admin]) => {
        if(isMatch) {
            jwt.sign( 
                { email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION },
                (err, token) => {
                    if(err) onError(err, res);
                    else res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                }
            );
        }
        else res.status(403).json({
            success: false,
            message: "Email or password is incorrect."
        });
    })
    .catch(err => onError(err, res));
}

const check = (req, res) => {
    res.json(req.user);
}

const funds = (req, res) => {
    Fund.findAll({
        where: { deleted: false },
        include: 'user'
    })
    .then(funds => res.json(funds))
    .catch(err => onError(err, res));
}

const fund = (req, res) => {
    Fund.findAll({
        where: {
            uid: req.params.uid,
            deleted: false
        },
        attributes: {
            include: [
                [literal('COUNT(donates.id) OVER()'), "cntDonate"],
                [literal('ROUND(SUM(donates.ethAmount) OVER (), 2)'), "sumDonateETH"],
                [literal('ROUND(SUM(donates.usdAmount) OVER (), 2)'), "sumDonateUSD"]
            ]
        },
        include: [
            {
                model: Donate,
                as: "donates",
                include: {
                    model: User,
                    as: 'user',
                    attributes: ["username", "firstName", "lastName", "avatar", "walletAddress"]
                },
            },
            { 
                model: User,
                as: 'user',
                attributes: ["username", "firstName", "lastName", "avatar", "walletAddress"]
            }
        ]
    })
    .then(fund => {
        if(fund.length) res.json(fund[0]);
        else res.status(404).json({
            success: false,
            message: "Cannot find this fund."
        });
    })
    .catch(err => onError(err, res));
}

const approve = (req, res) => {
    Fund.findOne({ where: { uid: req.params.uid } })
    .then(fund => fund.update({ approved: !fund.approved }))
    .then(fund => res.json({ success: true, approved: fund.approved }))
    .catch(err => onError(err, res));
}

const users = (req, res) => {
    User.findAll({ include: ['funds', 'donates'] })
    .then(users => res.json(users))
    .catch(err => onError(err, res));
}

const deleteUser = (req, res) => {
    User.findByPk(req.params.id)
    .then(user => user.update({ deleted: !user.deleted }))
    .then(user => res.json({ success: true, deleted: user.deleted }))
    .catch(err => onError(err, res));
}

const donates = (req, res) => {
    Donate.findAll({ include: ['user', 'fund'] })
    .then(donates => res.json(donates))
    .catch(err => onError(err, res));
}

module.exports = {
    login,
    check,
    funds,
    fund,
    approve,
    users,
    deleteUser,
    donates
}