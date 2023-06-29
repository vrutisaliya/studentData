// validator.js

const validator = require("validator");

const validateName = (name) => {
  if (!name || name.length < 5) {
    throw new Error("firstName should be at least 5 characters long.");
  }
};

const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email address.");
  }
};


const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }
};


const validateMobileNumber = (mobileNumber) => {
  if (!mobileNumber || !validator.isMobilePhone(mobileNumber)) {
    throw new Error("Invalid mobile number.");
  }
};

const validateUpdateUser = (data) => {
  const errors = [];

  if (data.firstName && data.firstName.length < 5) {
    errors.push("First name should be at least 5 characters long.");
  }

  if (data.lastName && data.lastName.length < 5) {
    errors.push("Last name should be at least 5 characters long.");
  }

  if (data.email && !validator.isEmail(data.email)) {
    errors.push("Invalid email address.");
  }

  if (data.mobileNumber && !validator.isMobilePhone(data.mobileNumber)) {
    errors.push("Invalid mobile number.");
  }

  return errors;
};
module.exports = {
  validateName,

  validateEmail,
  validatePasswordMatch,
  validateMobileNumber,
  validateUpdateUser,
};
