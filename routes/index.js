const router = require('express').Router();
const authRouter = require('./auth');
const fundRouter = require('./fund');
const userRouter = require('./user');

router.use('/auth', authRouter);
router.use('/fund', fundRouter);
router.use('/user', userRouter);
router.get('/ping', (req, res) => {
    res.send('pong');
});
router.use((req, res) => {
    return res.status(404).json({
        success: false
    });
});

module.exports = router;