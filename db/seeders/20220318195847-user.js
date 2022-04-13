'use strict';
const bcrypt = require('bcrypt');
const md5 = require('md5');

module.exports = {
  async up (queryInterface, Sequelize) {
    let password = await bcrypt.hash('password', 10);
    let email = 'test@email.com';
    let hash = md5(email);
    await queryInterface.bulkInsert('Users', [{
      username: 'John Doe',
      email: email,
      avatar: `https://avatars.dicebear.com/api/identicon/${hash}.svg`,
      password: password,
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
