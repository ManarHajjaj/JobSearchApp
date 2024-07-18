import Joi from "joi";
const dateFormat = (value, helpers) => {
  // Regular expression to match YYYY-MM-DD format

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) {
    return helpers.message("Date of Birth must be in the format YYYY-MM-DD");
  }
  // Parse the date string to check if it's a valid date
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return helpers.message("Invalid Date of Birth");
  }

  return value;
};
const signUpValidation = Joi.object({
  firstName: Joi.string().max(15).required(),
  lastName: Joi.string().max(15).required(),
  email: Joi.string().email().required().max(100),
  password: Joi.string().required().min(8).max(20),
  recoveryEmail: Joi.string().email().max(100).optional(),
  DOB: Joi.string().custom(dateFormat).required(),
  mobileNumber: Joi.string().max(11).required(),
  role: Joi.string().valid("User", "Company_HR").required(),
  status: Joi.string().valid("online", "offline").optional(),
});
// signIn schema Validation
const signInValidation = Joi.object({
  email: Joi.string().email().max(100),
  recoveryEmail: Joi.string().email().max(100),
  mobileNumber: Joi.string().max(11),
  password: Joi.string().required().min(8).max(20),
})
  .or("email", "recoveryEmail", "mobileNumber")
  .messages({
    "object.missing":
      "At least one of email, recoveryEmail, or mobileNumber must be provided along with the password",
  });

// updateUser Validation
const userUpdateValidation = Joi.object({
  email: Joi.string().email().max(100),
  mobileNumber: Joi.string().max(11),
  recoveryEmail: Joi.string().email().max(100),
  DOB: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lastName: Joi.string().min(2).max(100),
  firstName: Joi.string().min(2).max(100),
  userId: Joi.string().hex().length(24).required(),
});

// getByRecoveryEmail Validation
const getUserByRecoveryEmailValidation = Joi.object({
  recoveryEmail: Joi.string().email().max(100).required(),
});

// getanyData using userId validation
const userIdValidation = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});

// updateUserPasswordValidation
const updateUserPasswordValidation = Joi.object({
  password: Joi.string().required(),
  userId: Joi.string().hex().length(24).required(),
});
export {
  signUpValidation,
  signInValidation,
  userUpdateValidation,
  getUserByRecoveryEmailValidation,
  userIdValidation,
  updateUserPasswordValidation,
};
