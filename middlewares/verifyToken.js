import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const verifyToken = () => (req, res, next) => {
  // Authentication
  const token = req.headers.token?.replace("Bearer", "");

  // check if token exists in header
  if (!token) return next(new AppError("Please Sign in", 401));

  // verify jwt token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return next(new AppError("Invalid token", 498));
    req.user = decoded;
    next();
  });
};
