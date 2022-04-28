const router = require('express').Router();
const { adminValidator } = require('../config/passport');
const adminController = require('../controllers/admin');

router.post('/auth', adminController.login);
router.get('/check', adminValidator, adminController.check);
router.get('/funds', adminValidator, adminController.funds);
router.get('/fund/:uid', adminValidator, adminController.fund);
router.put('/approve/:uid', adminValidator, adminController.approve);
router.get('/users', adminValidator, adminController.users);
router.delete('/user/:id', adminValidator, adminController.deleteUser);
router.get('/donates', adminValidator, adminController.donates);

module.exports = router;