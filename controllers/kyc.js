const path = require("path");
const { KYC } = require("../config/sequelize");
const { validateKycCreate } = require("../utils/validator");

const upload = (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.img1 || !req.files.img2) {
        return res.status(400).json({
            success: false,
            message: "No files were uploaded."
        });
    }

    const file1 = req.files.img1;
    const file2 = req.files.img2;
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

const create = (req, res) => {
    const {isValid, errors} = validateKycCreate(req.body);
    if(!isValid) return res.status(422).json({
        success: false,
        message: errors
    });

    KYC.create({
        user_id: req.user.id,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        country: req.body.country,
        phone: req.body.phone,
        zip_code: req.body.zip,
        city: req.body.city,
        address: req.body.address,
        type_id: req.body.idType,
        id_number: req.body.number,
        expire: req.body.expire,
        image_1: req.body.img1,
        image_2: req.body.img2,
        wallet_address: req.body.ether,
    })
    .then(kyc => res.json(kyc))
    .catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

module.exports = {
    upload,
    create
}