const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const fundController = require('../controllers/fund');

router.post('/create', jwtValidator, fundController.create);
router.post('/upload', jwtValidator, fundController.upload);
router.get('/:uid', fundController.get);

module.exports = router;