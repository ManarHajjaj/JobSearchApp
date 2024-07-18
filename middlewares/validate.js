import { AppError } from "../utils/appError.js";

// Middleware for validation of the schemas
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(
      { ...req.body, ...req.params, ...req.query },
      { abortEarly: false }
    );
    if (error) {
      const errMsgs = error.details.map((err) => err.message).join(", ");
      res.json(errMsgs);
      return next(new AppError(errMsgs, 400));
    }
    next();
  };
};
