const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
require("dotenv").config();
require('./config/passport')(passport);

const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use((req, res) => {
    return res.status(404).json({
        success: false
    });
})

module.exports = app;
