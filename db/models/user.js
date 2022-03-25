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
    email_token: DataTypes.STRING,
    email_token_created_at: DataTypes.DATE,
    email_verified_at: DataTypes.DATE,
    avatar: DataTypes.STRING,
    password: DataTypes.STRING,
    password_token: DataTypes.STRING,
    password_token_created_at: DataTypes.DATE,
    remember_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};