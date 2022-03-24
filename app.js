const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require("dotenv").config();

const { passport } = require('./config/passport');
const authRouter = require('./routes/auth');

const app = express();
const public_path = path.join(__dirname, 'public');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use(express.static(public_path));
app.use('/auth', authRouter);
app.get('*', (req, res) => {
    res.sendFile(path.join(public_path, 'index.html'));
});
app.use((req, res) => {
    return res.status(404).json({
        success: false
    });
});

module.exports = app;
