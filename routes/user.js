const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const userController = require('../controllers/user');

router.post('/doc_upload', jwtValidator, userController.docUpload);
router.post('/avatar_upload', jwtValidator, userController.avatarUpload);
router.put('/profile', jwtValidator, userController.updateProfile);
router.put('/kyc', jwtValidator, userController.kyc);
router.put('/email_setting', jwtValidator, userController.emailSetting);
router.post('/confirmWallet', jwtValidator, userController.confirmWallet);
router.put('/change_wallet', jwtValidator, userController.updateWallet);
router.post('/confirmEmail', jwtValidator, userController.confirmEmail);

module.exports = router;