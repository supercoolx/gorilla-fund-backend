const crypto = require('crypto');

const generateRandomKey = () => crypto.randomBytes(32).toString('hex');

module.exports = generateRandomKey;