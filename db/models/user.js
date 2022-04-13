'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasOne(models.Customer, { as: 'customer', foreignKey: 'userId' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    emailToken: DataTypes.STRING,
    emailTokenCreatedAt: DataTypes.DATE,
    emailVerifiedAt: DataTypes.DATE,
    emailSetting: DataTypes.TINYINT,
    avatar: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordToken: DataTypes.STRING,
    passwordTokenCreatedAt: DataTypes.DATE,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    country: DataTypes.JSON,
    phone: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    identifyType: DataTypes.INTEGER,
    identifyNumber: DataTypes.STRING,
    identifyExpire: DataTypes.DATEONLY,
    document1: DataTypes.STRING,
    document2: DataTypes.STRING,
    walletAddress: DataTypes.STRING,
    metamaskToken: DataTypes.STRING,
    rememberToken: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};