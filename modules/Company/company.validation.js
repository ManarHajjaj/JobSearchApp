import Joi from "joi";

// addCompany Validation
export const addCompanyValidation = Joi.object({
  companyName: Joi.string().max(50).required(),
  description: Joi.string().max(500).required(),
  industry: Joi.string().max(200).required(),
  address: Joi.string().max(200).required(),
  numberOfEmployees: Joi.number().min(20).max(1000).required(),
  companyEmail: Joi.string().email().max(100).required(),
  companyHR: Joi.string().hex().length(24).required(),
});

// updateCompany Validation
export const updateCompanyValidation = Joi.object({
  companyName: Joi.string().max(50).required(),
  description: Joi.string().max(500).required(),
  industry: Joi.string().max(200).required(),
  address: Joi.string().max(200).required(),
  numberOfEmployees: Joi.number().min(20).max(1000).required(),
  companyEmail: Joi.string().email().max(100).required(),
  companyHR: Joi.string().hex().length(24),
  companyId: Joi.string().hex().length(24).required(),
});

// companyNameValidation
export const companyNameValidation = Joi.object({
  companyName: Joi.string().max(50).required(),
});

// validation on Id
export const companyIdValidation = Joi.object({
  companyId: Joi.string().hex().length(24).required(),
});
