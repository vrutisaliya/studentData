// validator.js

const validator = require("validator");

const validateStudentId = (studentId) => {
  if (!studentId || studentId.length > 5) {
    throw new Error("Student ID should be at least 5 characters long.");
  }
};

const validateStander = (stander) => {
  if (stander < 1 || stander > 12) {
    throw new Error("Stander should be a number between 1 and 12.");
  }
};

const validateAge = (age) => {
  if (age < 1 || age > 120) {
    throw new Error("Age should be a number between 1 and 120.");
  }
};

const validateName = (name) => {
  if (name < 1 || name > 12) {
    throw new Error("Name should be at between 1 to 12 characters long.");
  }
};

const validateEmail = (email) => {
  if (!email || !validator.isEmail(email.toString())) {
    errors.email = "Email must have a valid format.";
  }
};
const validateGender = (gender) => {
  if (!gender || !["male", "female"].includes(gender)) {
    throw new Error(
      "Invalid gender. Gender should be either 'male' or 'female'."
    );
  }
};

const validateMobileNumber = (mobileNumber) => {
  if (!mobileNumber || !validator.isMobilePhone(mobileNumber)) {
    throw new Error("Invalid mobile number.");
  }
};

module.exports = {
  validateStudentId,
  validateStander,
  validateAge,
  validateName,
  validateEmail,
  validateGender,
  validateMobileNumber,
};
