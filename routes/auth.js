const express = require('express');
const router = express.Router();
const { jwtValidator } = require('../config/passport');
const authController = require('../controllers/auth');

/* GET users listing. */
router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.get('/me', jwtValidator, authController.me);

module.exports = router;
