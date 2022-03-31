const crypto = require('crypto');

const generateRandomKey = () => crypto.randomBytes(32).toString('hex');
const generateRandomNumber = () => Math.floor(Math.random() * 9000) + 1000;
const generateUid = str => str.toLowerCase().replace(/[^A-Za-z0-9]/g, " ").trim().replace(/ +/g, '-') + "-" + Date.now();

module.exports = {
    generateRandomKey,
    generateRandomNumber,
    generateUid
}