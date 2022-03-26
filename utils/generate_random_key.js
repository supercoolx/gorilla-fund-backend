const crypto = require('crypto');

const generateRandomKey = () => crypto.randomBytes(32).toString('hex');
const generateRandomNumber = () => Math.floor(Math.random() * 9000) + 1000;

module.exports = {
    generateRandomKey,
    generateRandomNumber
}