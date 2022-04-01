'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kyc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  kyc.init({
    userId: DataTypes.BIGINT,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    country: DataTypes.JSON,
    phone: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    typeId: DataTypes.INTEGER,
    idNumber: DataTypes.STRING,
    expire: DataTypes.DATE,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
    walletAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kyc',
  });
  return kyc;
};