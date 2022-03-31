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
      user_id: {
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
      category_id: {
        type: Sequelize.INTEGER
      },
      wallet_address: {
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