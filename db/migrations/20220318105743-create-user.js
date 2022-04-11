'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      emailToken: {
        type: Sequelize.STRING
      },
      emailTokenCreatedAt: {
        type: Sequelize.DATE
      },
      emailVerifiedAt: {
        type: Sequelize.DATE
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      emailSetting: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      password: {
        type: Sequelize.STRING
      },
      passwordToken: {
        type: Sequelize.STRING
      },
      passwordTokenCreatedAt: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING,
        unique: true
      },
      metamaskToken: {
        type: Sequelize.STRING,
        unique: true
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