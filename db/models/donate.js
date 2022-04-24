'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Donate.init({
    fundId: DataTypes.BIGINT,
    userId: DataTypes.BIGINT,
    fromAddress: DataTypes.STRING,
    toAddress: DataTypes.STRING,
    transactionId: DataTypes.STRING,
    ethAmount: DataTypes.FLOAT,
    usdAmount: DataTypes.FLOAT,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Donate',
  });
  return Donate;
};