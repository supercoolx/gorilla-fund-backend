const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const userController = require('../controllers/user');

router.post('/doc_upload', jwtValidator, userController.docUpload);
router.put('/kyc', jwtValidator, userController.kyc);
router.put('/email_setting', jwtValidator, userController.emailSetting);
router.post('/confirmWallet', jwtValidator, userController.confirmWallet);

module.exports = router;