const { preSignupValidation, postConfirmation } = require('./triggers');

exports.handler = postConfirmation;
