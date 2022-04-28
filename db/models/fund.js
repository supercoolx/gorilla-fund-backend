'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Fund.init({
    uid: DataTypes.STRING,
    userId: DataTypes.BIGINT,
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    walletAddress: DataTypes.STRING,
    image: DataTypes.STRING,
    headline: DataTypes.STRING,
    description: DataTypes.TEXT,
    allowDonorComment: DataTypes.BOOLEAN,
    allowVisitorComment: DataTypes.BOOLEAN,
    allowDonation: DataTypes.BOOLEAN,
    allowSearch: DataTypes.BOOLEAN,
    approved: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Fund',
  });
  return Fund;
};