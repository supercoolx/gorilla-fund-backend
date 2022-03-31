const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const fundController = require('../controllers/fund');

router.get('/top_rated', fundController.topRated);
router.get('/search', fundController.search);
router.post('/create', jwtValidator, fundController.create);
router.post('/upload', jwtValidator, fundController.upload);
router.get('/:uid', fundController.findByUid);

module.exports = router;