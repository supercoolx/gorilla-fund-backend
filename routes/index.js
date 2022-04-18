const router = require('express').Router();
const authRouter = require('./auth');
const fundRouter = require('./fund');
const userRouter = require('./user');
const mail = require('../config/mail');

router.use('/auth', authRouter);
router.use('/fund', fundRouter);
router.use('/user', userRouter);
router.use('/ping', (req, res) => {
    mail.sendMail({
        from: process.env.MAIL_USER,
        to: 'stepan912@dispomail.win',
        subject: 'Sending email using node.js',
        text: 'That was easy!'
    })
    .then(info => res.json(info.response))
    .catch(err => res.send(err.message));
});
router.use((req, res) => {
    return res.status(404).json({
        success: false
    });
});

module.exports = router;