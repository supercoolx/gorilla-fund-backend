const router = require('express').Router();
const authRouter = require('./auth');
const fundRouter = require('./fund');
const kycRouter = require('./kyc');

router.use('/auth', authRouter);
router.use('/fund', fundRouter);
router.use('/kyc', kycRouter);
router.use((req, res) => {
    return res.status(404).json({
        success: false
    });
})

module.exports = router;