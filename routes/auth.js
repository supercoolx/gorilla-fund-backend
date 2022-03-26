const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const authController = require('../controllers/auth');

/* GET users listing. */
router.post('/signin', authController.signIn);
router.put('/signup', authController.signUp);
router.post('/forget_password', authController.forgetPassword);
router.post('/reset_password', authController.resetPassword);
router.post('/verify_reset_link', authController.verifyResetLink);
router.post('/set_verify_email', jwtValidator, authController.setVerifyEmail);
router.post('/verify_email', jwtValidator, authController.verifyEmail);
router.get('/me', jwtValidator, authController.me);

module.exports = router;
