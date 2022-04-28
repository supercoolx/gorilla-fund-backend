const onError = require('../utils/error');
const { Donate } = require('../config/sequelize');
const { validateDonate } = require('../utils/validator');

const create = (req, res) => {
    const data = req.body;
    const {isValid, errors} = validateDonate(data);
    if(!isValid) return res.status(403).json({
        success: false,
        errors
    });

    const donateData = {
        userId: req.user.id,
        fundId: data.fundId,
        fromAddress: data.fromAddress,
        toAddress: data.toAddress,
        transactionId: data.transactionId,
        ethAmount: data.ethAmount,
        usdAmount: data.usdAmount
    }
    req.body.comment && ( donateData.comment = req.body.comment );
    
    Donate.create(donateData)
    .then(donate => res.json(donate))
    .catch(err => onError(err, res));
}

module.exports = {
    create
}