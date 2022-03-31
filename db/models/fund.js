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
    user_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    wallet_address: DataTypes.STRING,
    image: DataTypes.STRING,
    headline: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Fund',
  });
  return Fund;
};