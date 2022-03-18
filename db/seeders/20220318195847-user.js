'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    let password = await bcrypt.hash('password', 10);
    await queryInterface.bulkInsert('Users', [{
      name: 'John Doe',
      email: 'test@email.com',
      password: password,
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
