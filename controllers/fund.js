const path = require('path');
const { Op } = require('sequelize');
const { Fund, User } = require('../config/sequelize');
const { validateFundCreate } = require('../utils/validator');
const { generateUid } = require('../utils/generate_random');

const create = (req, res) => {
    const data = req.body;
    const { isValid, errors } = validateFundCreate(data);
    if(!isValid) return res.status(422).json(errors);

    const uid = generateUid(data.name);
    Fund.create({
        uid: uid,
        user_id: req.user.id,
        name: data.name,
        amount: parseInt(data.amount),
        for_id: parseInt(data.forId),
        wallet_address: data.walletAddress,
        image: data.image,
        headline: data.headline,
        description: data.description
    })
    .then(fund => {
        res.json(fund);
    })
    .catch(err => 
        res.status(500).json({
            success: false,
            message: err.message
        })
    );
}

const upload = (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.photo) {
        return res.status(400).json({
            success: false,
            message: "No files were uploaded."
        })
    }

    const photoFile = req.files.photo;
    const fileName = Date.now() + "_" + photoFile.name;
    const filePath = "/uploads/fund/" + fileName;
    const uploadPath = path.resolve("public", "uploads", "fund", fileName);

    photoFile.mv(uploadPath)
    .then(() => {
        res.json({
            success: true,
            filePath: filePath
        });
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
}

const get = (req, res) => {
    Fund.findOne({ where: { uid: req.params.uid }})
    .then(fund => {
        if(fund) res.json(fund);
        else res.status(404).json({
            success: false,
            message: "Cannot find this fund."
        });
    })
    .catch(err =>
        res.status(500).json({
            success: false,
            message: err.message
        })
    );
}

module.exports = {
    create,
    upload,
    get
}