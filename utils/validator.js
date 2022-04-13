const validator = require('validator');
const isEmpty = require('./is_empty');

const validateUserSignup = data => {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    if(!/^\w+$/.test(data.username)){
        errors.username = "Must be alphanumeric.";
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
    if(isEmpty(data.categoryId)) {
        isValid = false;
        errors.categoryId = "What are you fundraising for?";
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

const validateKycCreate = data => {
    let isValid = true;
    let errors = {};
    if(!data.firstName?.trim()) {
        isValid = false;
        errors.firstName = "First name is required.";
    }
    if(!data.lastName?.trim()) {
        isValid = false;
        errors.lastName = "Last name is required.";
    }
    if(!data.country) {
        isValid = false;
        errors.country = "Country is required.";
    }
    if(!data.phone?.trim()) {
        isValid = false;
        errors.phone = "Phone number is required.";
    }
    if(!data.zipCode?.trim()) {
        isValid = false;
        errors.zipCode = "Zip code is required.";
    }
    if(!data.city?.trim()) {
        isValid = false;
        errors.city = "City is required.";
    }
    if(!data.address?.trim()) {
        isValid = false;
        errors.address = "Address is required.";
    }
    if(!data.identifyType || 1 > data.identifyType || data.identifyType > 3) {
        isValid = false;
        errors.identifyType = "Select identity type.";
    }
    if(!data.identifyNumber?.trim()) {
        isValid = false;
        errors.identifyNumber = "Identity number is required.";
    }
    if(!data.identifyExpire) {
        isValid = false;
        errors.identifyExpire = "Expire date is required.";
    }
    if(!data.doc1?.trim()) {
        isValid = false;
        errors.doc1 = "Please upload image.";
    }
    if(!data.doc2?.trim()) {
        isValid = false;
        errors.doc2 = "Please upload image.";
    }
    if(!data.walletAddress?.trim()) {
        isValid = false;
        errors.walletAddress = "Wallet address is required.";
    }

    return { isValid, errors }
}

module.exports = {
    validateUserSignup,
    validateUserSignin,
    validateFundCreate,
    validateKycCreate
}