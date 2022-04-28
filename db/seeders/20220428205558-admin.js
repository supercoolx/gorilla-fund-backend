'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    let password = await bcrypt.hash('apegorillaclub', 10);
    let email = 'silvanschwarz23@gmail.com';
    await queryInterface.bulkInsert('Admins', [{ email, password }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  }
};
