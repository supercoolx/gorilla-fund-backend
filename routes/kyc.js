const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const kycController = require('../controllers/kyc');

router.post('/upload', jwtValidator, kycController.upload);
router.post('/create', jwtValidator, kycController.create);

module.exports = router;