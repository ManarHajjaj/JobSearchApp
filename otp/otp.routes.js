import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requestPasswordReset, resetPassword } from "./otp.controllers.js";
import { verifyUserToResetPassword } from "./otp.middlewares.js";

const otpRouter = Router();
otpRouter
  .route("/request-password-reset/:userId")
  .post(verifyToken(), verifyUserToResetPassword, requestPasswordReset);
otpRouter.route("/reset-password").post(verifyToken(), resetPassword);
export default otpRouter;
