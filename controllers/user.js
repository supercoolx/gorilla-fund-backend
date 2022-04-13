const path = require("path");
const { User } = require("../config/sequelize");
const { validateKycCreate } = require("../utils/validator");

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
    .catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
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
    .catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

const emailSetting = (req, res) => {
    req.user.update({ emailSetting: req.body.val })
    .then(r => res.json({ success: true }))
    .catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

const confirmWallet = (req, res) => {
    if(req.user.walletAddress === req.body.walletAddress) return res.json({ success: true });
    User.findOne({ where: { walletAddress: req.body.walletAddress } })
    .then(user => {
        if(user) res.json({ success: false });
        else res.json({ success: true });
    })
    .catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

module.exports = {
    docUpload,
    kyc,
    emailSetting,
    confirmWallet
}