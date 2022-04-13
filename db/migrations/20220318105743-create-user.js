'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      emailToken: {
        type: Sequelize.STRING,
      },
      emailTokenCreatedAt: {
        type: Sequelize.DATE
      },
      emailVerifiedAt: {
        type: Sequelize.DATE
      },
      emailSetting: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      avatar: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      passwordToken: {
        type: Sequelize.STRING,
      },
      passwordTokenCreatedAt: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.JSON,
      },
      phone: {
        type: Sequelize.STRING,
      },
      zipCode: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      identifyType: {
        type: Sequelize.INTEGER,
        default: 0
      },
      identifyNumber: {
        type: Sequelize.STRING,
      },
      identifyExpire: {
        type: Sequelize.DATE,
      },
      document1: {
        type: Sequelize.STRING,
      },
      document2: {
        type: Sequelize.STRING,
      },
      walletAddress: {
        type: Sequelize.STRING,
        unique: true
      },
      metamaskToken: {
        type: Sequelize.STRING,
      },
      rememberToken: {
        type: Sequelize.STRING,
        unique: true
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};