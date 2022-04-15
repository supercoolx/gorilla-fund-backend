const validator = require('validator');
const isEmpty = require('./is_empty');

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
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.email)) errors.email = 'Email field is required';
    if (!validator.isEmail(data.email)) errors.email = 'Email is invalid';
    if (validator.isEmpty(data.password)) errors.password = 'Password field is required';
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
    if(!data.firstName?.trim()) errors.firstName = "First name is required.";
    if(!data.lastName?.trim()) errors.lastName = "Last name is required.";
    if(!data.country) errors.country = "Country is required.";
    if(!data.phone?.trim()) errors.phone = "Phone number is required.";
    if(!data.zipCode?.trim()) errors.zipCode = "Zip code is required.";
    if(!data.city?.trim()) errors.city = "City is required.";
    if(!data.address?.trim()) errors.address = "Address is required.";
    if(!data.identifyType || 1 > data.identifyType || data.identifyType > 3) errors.identifyType = "Select identity type.";
    if(!data.identifyNumber?.trim()) errors.identifyNumber = "Identity number is required.";
    if(!data.identifyExpire) errors.identifyExpire = "Expire date is required.";
    if(!data.doc1?.trim()) errors.doc1 = "Please upload image.";
    if(!data.doc2?.trim()) errors.doc2 = "Please upload image.";
    if(!data.walletAddress?.trim()) errors.walletAddress = "Wallet address is required.";

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

const validateProfile = data => {
    let errors = {};
    if(!data.firstName?.trim()) errors.firstname = "First name is required.";
    if(!data.lastName?.trim()) errors.lastName = "Last name is required.";
    if(!/^\w+$/.test(data.username)) errors.username = "Must be alphanumeric.";
    if(!validator.isEmail(data.email)) errors.email = "Email is invalid.";
    if(!data.phone?.trim()) errors.phone = "Phone number is required.";
    if(!data.address?.trim()) errors.address = "Address is required.";
    if(!data.country) errors.country = "Country is required."
    if(!data.city?.trim()) errors.city = "City is required.";
    if(!data.zipCode?.trim()) errors.zipCode = "Zip code is required.";
    
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
    validateProfile
}