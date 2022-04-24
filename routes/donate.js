const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const donateController = require('../controllers/donate');

router.post('/create', jwtValidator, donateController.create);

module.exports = router;