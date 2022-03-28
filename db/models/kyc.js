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
    user_id: DataTypes.BIGINT,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    country: DataTypes.JSON,
    phone: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    type_id: DataTypes.INTEGER,
    id_number: DataTypes.STRING,
    expire: DataTypes.DATE,
    image_1: DataTypes.STRING,
    image_2: DataTypes.STRING,
    wallet_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kyc',
  });
  return kyc;
};