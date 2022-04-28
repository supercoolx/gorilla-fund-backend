const router = require('express').Router();
const adminController = require('../controllers/admin');

router.get('/funds', adminController.funds);
router.get('/fund/:uid', adminController.fund);
router.put('/approve/:uid', adminController.approve);

module.exports = router;