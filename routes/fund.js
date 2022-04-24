const router = require('express').Router();
const { jwtValidator } = require('../config/passport');
const fundController = require('../controllers/fund');

router.get('/my', jwtValidator, fundController.myFunds);
router.get('/my/:uid', jwtValidator, fundController.myFund);
router.get('/top_rated', fundController.topRated);
router.get('/search', fundController.search);
router.get('/overview', fundController.overview);
router.post('/create', jwtValidator, fundController.create);
router.post('/upload', jwtValidator, fundController.upload);
router.put('/:uid', jwtValidator, fundController.update);
router.delete('/:uid', jwtValidator, fundController.deleteFund);
router.get('/:uid', fundController.findByUid);

module.exports = router;