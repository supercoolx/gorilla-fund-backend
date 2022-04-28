'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Funds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      walletAddress: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      headline: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      allowDonorComment: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      allowVisitorComment: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      allowDonation: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      allowSearch: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Funds');
  }
};