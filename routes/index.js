const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const fundRouter = require('./fund');
const donateRouter = require('./donate');
const adminRouter = require('./admin');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/fund', fundRouter);
router.use('/donate', donateRouter);
router.use('/admin', adminRouter);

router.get('/ping', (req, res) => {
    res.send('pong');
});

router.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Cannot find api '${req.originalUrl}'`
    });
});

module.exports = router;