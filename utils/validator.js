const validator = require('validator');
const isEmpty = require('./is_empty');
const { isValidAddress } = require('ethereumjs-util');

const validateUserSignup = data => {
    let errors = {};
    if(!/^\w+$/.test(data.username)) errors.username = "Must be alphanumeric.";
    if(!validator.isLength(data.password, {min: 8})) errors.password = "Must be at least 8 characters.";
    if(!validator.isEmail(data.email)) errors.email = "Email is invalid.";
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

const validateUserSignin = data => {
    let errors = {};

    if (isEmpty(data.email)) errors.email = 'Email field is required';
    else if (!validator.isEmail(data.email)) errors.email = 'Email is invalid';
    if (isEmpty(data.password)) errors.password = 'Password field is required';
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

const validateFundCreate = data => {
    let errors = {};
    if(isEmpty(data.name)) errors.name = "Name field is required.";
    if(isEmpty(data.amount) || parseInt(data.amount) <= 0 ) errors.amount = "Amount field is incorrect.";
    if(isEmpty(data.categoryId)) errors.categoryId = "What are you fundraising for?";
    if(isEmpty(data.walletAddress)) errors.walletAddress = "Wallet address is required.";
    else if(!isValidAddress(data.walletAddress)) errors.walletAddress = "Wallet address is invalid.";
    if(isEmpty(data.image)) errors.image = "Please upload image";
    if(isEmpty(data.headline)) errors.headline = "Headline is required";
    if(isEmpty(data.description)) errors.description = "Description is requried";

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

const validateKycCreate = data => {
    let errors = {};
    if(isEmpty(data.firstName)) errors.firstName = "First name is required.";
    if(isEmpty(data.lastName)) errors.lastName = "Last name is required.";
    if(isEmpty(data.country)) errors.country = "Country is required.";
    if(isEmpty(data.phone)) errors.phone = "Phone number is required.";
    if(isEmpty(data.zipCode)) errors.zipCode = "Zip code is required.";
    if(isEmpty(data.city)) errors.city = "City is required.";
    if(isEmpty(data.address)) errors.address = "Address is required.";
    if(!data.identifyType || 1 > data.identifyType || data.identifyType > 3) errors.identifyType = "Select identity type.";
    if(isEmpty(data.identifyNumber)) errors.identifyNumber = "Identity number is required.";
    if(isEmpty(data.identifyExpire)) errors.identifyExpire = "Expire date is required.";
    if(isEmpty(data.doc1)) errors.doc1 = "Please upload image.";
    if(isEmpty(data.doc2)) errors.doc2 = "Please upload image.";
    if(isEmpty(data.walletAddress)) errors.walletAddress = "Wallet address is required.";
    else if(!isValidAddress(data.walletAddress)) errors.walletAddress = "Wallet address is not Valid.";

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

const validateProfile = data => {
    let errors = {};
    if(isEmpty(data.firstName)) errors.firstname = "First name is required.";
    if(isEmpty(data.lastName)) errors.lastName = "Last name is required.";
    if(!/^\w+$/.test(data.username)) errors.username = "Must be alphanumeric.";
    if(!validator.isEmail(data.email)) errors.email = "Email is invalid.";
    if(isEmpty(data.phone)) errors.phone = "Phone number is required.";
    if(isEmpty(data.address)) errors.address = "Address is required.";
    if(isEmpty(data.country)) errors.country = "Country is required.";
    if(isEmpty(data.city)) errors.city = "City is required.";
    if(isEmpty(data.zipCode)) errors.zipCode = "Zip code is required.";
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

validateDonate = data => {
    let errors = {};
    if(typeof(data.fundId) !== 'number') errors.fundId = "Fund ID is invalid.";
    if(isEmpty(data.fromAddress)) errors.fromAddress = "From Address is required.";
    else if(!isValidAddress(data.fromAddress)) errors.fromAddress = "From Address is invalid";
    if(isEmpty(data.toAddress)) errors.toAddress = "To Address is required.";
    else if(!isValidAddress(data.toAddress)) errors.toAddress = "To Address is invalid";
    if(isEmpty(data.transactionId)) errors.transactionId = "Transaction ID is required.";
    if(typeof(data.ethAmount) !== 'number') errors.ethAmount = "ETH amount is invalid.";
    if(typeof(data.usdAmount) !== 'number') errors.usdAmount = "USD amount is invalid.";

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = {
    validateUserSignup,
    validateUserSignin,
    validateFundCreate,
    validateKycCreate,
    validateProfile,
    validateDonate,
}