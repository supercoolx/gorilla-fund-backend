const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../db/models/user');

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql"
    }
);

const User = UserModel(sequelize, DataTypes);

module.exports = User;