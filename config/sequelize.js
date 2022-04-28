const { Sequelize, DataTypes } = require('sequelize');
const AdminModel = require('../db/models/admin');
const UserModel = require('../db/models/user');
const FundModel = require('../db/models/fund');
const DonateModel = require('../db/models/donate');

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql"
    }
);

const Admin = AdminModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Fund = FundModel(sequelize, DataTypes);
const Donate = DonateModel(sequelize, DataTypes);

User.hasMany(Fund, { as: "funds", foreignKey: "userId" });
Fund.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Donate, { as: "donates", foreignKey: "userId" });
Donate.belongsTo(User, { as: "user", foreignKey: "userId" });
Fund.hasMany(Donate, { as: "donates", foreignKey: "fundId" });
Donate.belongsTo(Fund, { as: "fund", foreignKey: "fundId" });

module.exports = {
    Admin,
    User,
    Fund,
    Donate,
}