const md5 = require('md5');
const path = require("path");
const moment = require("moment");
const onError = require('../utils/error');
const { User } = require("../config/sequelize");
const { generateRandomNumber } = require("../utils/generate_random");
const { validateKycCreate, validateProfile } = require("../utils/validator");

const docUpload = (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.doc1 || !req.files.doc2) {
        return res.status(400).json({
            success: false,
            message: "No files were uploaded."
        });
    }

    const file1 = req.files.doc1;
    const file2 = req.files.doc2;
    const fileName1 = Date.now() + "_" + file1.name;
    const fileName2 = Date.now() + "_" + file2.name;
    if(fileName1 === fileName2) fileName2 = "1_" + fileName2;
    const filePath1 = "/uploads/kyc/" + fileName1;
    const filePath2 = "/uploads/kyc/" + fileName2;
    const uploadPath = path.resolve("public", "uploads", "kyc");

    file1.mv(path.join(uploadPath, fileName1))
    .then(() => file2.mv(path.join(uploadPath, fileName2)))
    .then(() => res.json({
        success: true,
        path1: filePath1,
        path2: filePath2
    }))
    .catch(err => onError(err, res));
}

const avatarUpload = (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.avatar) {
        let hash = md5(req.user.email || req.user.walletAddress);
        let avatar = `https://avatars.dicebear.com/api/identicon/${hash}.svg`;
        req.user.update({ avatar })
        .then(() => res.json({
            success: true,
            path: avatar
        }))
        .catch(err => onError(err, res));
    }
    else {
        const file = req.files.avatar;
        const fileName = Date.now() + "_" + file.name;
        const filePath = "/uploads/avatar/" + fileName;
        const uploadPath = path.resolve("public", "uploads", "avatar");
        file.mv(path.join(uploadPath, fileName))
        .then(() => req.user.update({ avatar: filePath }))
        .then(() => res.json({
            success: true,
            path: filePath
        }))
        .catch(err => onError(err, res));
    }
}

const updateProfile = (req, res) => {
    const data = req.body;
    const { errors, isValid } = validateProfile(data);
    if(!isValid) res.status(422).json({
        success: false,
        message: errors
    });
    
    const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        country: req.body.country,
        city: req.body.city,
        zipCode: req.body.zipCode,
    }
    if(req.user.email !== req.body.email) {
        updateData.emailToken = generateRandomNumber();
        updateData.emailTokenCreatedAt = moment().format();
        updateData.emailVerifiedAt = null;
    }
    req.user.update(updateData).then(user => res.json({ success: true }))
    .catch(err => onError(err, res));
}

const kyc = async (req, res) => {
    const {isValid, errors} = validateKycCreate(req.body);
    if(!isValid) return res.status(422).json({
        success: false,
        message: errors
    });
    
    if(req.user.walletAddress !== req.body.walletAddress) {
        let sameAddressUser = await User.findOne({ where: { walletAddress: req.body.walletAddress } });
        if(sameAddressUser) return res.status(401).json({
            success: false,
            message: "Address is already in use"
        });
    }
    
    req.user.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        phone: req.body.phone,
        zipCode: req.body.zipCode,
        city: req.body.city,
        address: req.body.address,
        identifyType: req.body.identifyType,
        identifyNumber: req.body.identifyNumber,
        identifyExpire: req.body.identifyExpire,
        document1: req.body.doc1,
        document2: req.body.doc2,
        walletAddress: req.body.walletAddress,
    })
    .then(user => res.json({ success: true }) )
    .catch(err => onError(err, res));
}

const emailSetting = (req, res) => {
    req.user.update({ emailSetting: req.body.val })
    .then(r => res.json({ success: true }))
    .catch(err => onError(err, res));
}

const confirmWallet = (req, res) => {
    if(req.user.walletAddress === req.body.walletAddress) return res.json({ success: true });
    User.findOne({ where: { walletAddress: req.body.walletAddress } })
    .then(user => {
        if(user) res.json({ success: false });
        else res.json({ success: true });
    })
    .catch(err => onError(err, res));
}

const updateWallet = async (req, res) => {
    const { walletAddress } = req.body;

    if(req.user.walletAddress !== walletAddress) {
        let sameAddressUser = await User.findOne({ where: { walletAddress } });
        if(sameAddressUser) return res.status(401).json({
            success: false,
            message: "Address is already in use"
        });
    }

    req.user.update({ walletAddress })
    .then(() => res.json({ success: true }))
    .catch(err => onError(err, res));
}

const confirmEmail = (req, res) => {
    if(req.user.email === req.body.email) return res.json({ success: true });
    User.findOne({ where: { email: req.body.email } })
    .then(user => {
        if(user) res.json({ success: false });
        else res.json({ success: true });
    })
    .catch(err => onError(err, res));
}

module.exports = {
    docUpload,
    avatarUpload,
    updateProfile,
    kyc,
    emailSetting,
    confirmWallet,
    updateWallet,
    confirmEmail,
}