const validator = require('validator');

const validateName = (name) => {
  if (!name || name.length < 5) {
    throw new Error('Name should be at least 5 characters long.');
  }
};

const validateDescription = (description) => {
  if (!description || description.length < 10) {
    throw new Error('Description should be at least 10 characters long.');
  }
};

const validatePostImageURL = (postImageURL) => {
  if (!postImageURL || !validator.isURL(postImageURL)) {
    throw new Error('Invalid post image URL.');
  }
};

const validateLocation = (location) => {
  if (!location) {
    throw new Error('Location is required.');
  }
};

const validatePost = (data) => {
  const errors = [];

  if (data.name) {
    validateName(data.name);
  } else {
    errors.push('Name is required.');
  }

  if (data.description) {
    validateDescription(data.description);
  } else {
    errors.push('Description is required.');
  }

  if (data.postImageURL) {
    validatePostImageURL(data.postImageURL);
  } else {
    errors.push('Post Image URL is required.');
  }

  if (data.location) {
    validateLocation(data.location);
  } else {
    errors.push('Location is required.');
  }

  return errors;
};

module.exports = {
  validatePost,
};
