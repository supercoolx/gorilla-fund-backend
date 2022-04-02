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
        userId: req.user.id,
        name: data.name,
        amount: parseInt(data.amount),
        categoryId: parseInt(data.categoryId),
        walletAddress: data.walletAddress,
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

const topRated = (req, res) => {
    let { count } = req.query;
    count = parseInt(count);
    count = count ? count : 1;
    Fund.findAll({
        limit: count,
        order: [["amount", "DESC"]]
    })
    .then(funds => res.json(funds))
    .catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

const findByUid = (req, res) => {
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

const myFund = (req, res) => {
    Fund.findOne({ where: {
        uid: req.params.uid,
        userId: req.user.id
    }})
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

const search = (req, res) => {
    const query = req.query;
    const condition = { where: {} };
    if(query.s) condition.where = {
        [Op.or]: [
            { name: { [Op.like]: `%${query.s}%` } },
            { headline: { [Op.like]: `%${query.s}%` } },
            { description: { [Op.like]: `%${query.s}%` } }
        ],
    }
    if(query.category) condition.where.categoryId = query.category;
    if(query.sort) {
        if(query.sort === "1") condition.order = [["createdAt", "DESC"]];
        if(query.sort === "2") condition.order = [["amount", "DESC"]];
    }
    Fund.findAll(condition).then(funds => res.json(funds)).catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

const getByUser = (req, res) => {
    const user = req.user;
    User.findOne({
        where: { id: user.id },
        include: "funds",
    })
    .then(funds => res.json(funds)).catch(err => res.status(500).json({
        success: false,
        message: err.message
    }));
}

const update = async (req, res) => {
    const { uid } = req.params;
    const updates = req.body;

    delete updates.id;
    delete updates.uid;
    delete updates.userId;

    const fund = await Fund.findOne({
        where: {
            uid: uid,
            userId: req.user.id
        }
    });
    if(!fund) return res.status(404).json({
        success: false,
        message: "Cannot find this fund."
    });
    fund.update(updates).then(fund => res.json(fund)).catch(err => res.status(500).json({
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

const deleteFund = (req, res) => {
    const { uid } = req.params;
    Fund.destroy({
        where: {
            uid: uid,
            userId: req.user.id
        }
    })
    .then(result => {
        if(!result) res.status(404).json({
            success: false,
            message: "Cannot find this fund."
        });
        else res.json({ success: true });
    })
    .catch(err => res.json({
        success: false,
        message: err.message
    }));
}

module.exports = {
    create,
    upload,
    topRated,
    findByUid,
    search,
    getByUser,
    update,
    myFund,
    emailSetting,
    deleteFund
}