import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("Your role is not authorized to perform this action", 403)
    );
  }
  next();
};
