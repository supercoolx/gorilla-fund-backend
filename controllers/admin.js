const onError = require('../utils/error');
const { literal } = require('sequelize');
const { Fund, Donate, User } = require('../config/sequelize');

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

module.exports = {
    funds,
    fund,
    approve,
}