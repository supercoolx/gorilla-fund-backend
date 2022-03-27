const validator = require('validator');
const isEmpty = require('./is_empty');

const validateUserSignup = data => {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    if(!validator.isLength(data.name, {min: 2})){
        errors.name = "Must be at least 2 characters.";
    }
    if(!validator.isLength(data.password, {min: 8})){
        errors.password = "Must be at least 8 characters.";
    }
    if(!validator.isEmail(data.email)){
        errors.email = "Email is invalid.";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

const validateUserSignin = data => {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

const validateFundCreate = data => {
    let isValid = true;
    let errors = {};
    if(isEmpty(data.name)) {
        isValid = false;
        errors.name = "Name field is required.";
    }
    if(isEmpty(data.amount) || parseInt(data.amount) <= 0 ) {
        isValid = false;
        errors.amount = "Amount field is incorrect.";
    }
    if(isEmpty(data.forId)) {
        isValid = false;
        errors.forId = "What are you fundraising for?";
    }
    if(isEmpty(data.walletAddress)) {
        isValid = false;
        errors.walletAddress = "Wallet address is required.";
    }
    if(isEmpty(data.image)) {
        isValid = false;
        errors.image = "Please upload image";
    }
    if(isEmpty(data.headline)) {
        isValid = false;
        errors.headline = "Headline is required";
    }
    if(isEmpty(data.description)) {
        isValid = false;
        errors.description = "Description is requried";
    }

    return {
        isValid,
        errors
    };
}

module.exports = {
    validateUserSignup,
    validateUserSignin,
    validateFundCreate
}