import Joi from "joi";

// validation on Id
export const applicationIdValidation = Joi.object({
  jobId: Joi.string().hex().length(24).required(),
});
