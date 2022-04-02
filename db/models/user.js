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
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    emailToken: DataTypes.STRING,
    emailTokenCreatedAt: DataTypes.DATE,
    emailVerifiedAt: DataTypes.DATE,
    avatar: DataTypes.STRING,
    emailSetting: DataTypes.TINYINT,
    password: DataTypes.STRING,
    passwordToken: DataTypes.STRING,
    passwordTokenCreatedAt: DataTypes.DATE,
    rememberToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};