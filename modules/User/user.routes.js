import { Router } from "express";
import {
  deleteUser,
  getAllAccountsByRecoveryEmail,
  getAllUsers,
  getProfileDataForAnotherUser,
  getUser,
  signIn,
  signUp,
  updateUser,
  updateUserPassword,
} from "./user.controllers.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { validate } from "../../middlewares/validate.js";
import {
  signUpValidation,
  signInValidation,
  userUpdateValidation,
  getUserByRecoveryEmailValidation,
  userIdValidation,
  updateUserPasswordValidation,
} from "./user.validation.js";
const userRouter = Router();

userRouter.post("/signup", validate(signUpValidation), signUp);
userRouter.post("/signin", validate(signInValidation), signIn);
userRouter.route("/").get(getAllUsers);
userRouter.get(
  "/accounts",
  verifyToken(),
  validate(getUserByRecoveryEmailValidation),
  getAllAccountsByRecoveryEmail
);
userRouter.put(
  "/updatePassword/:userId",
  verifyToken(),
  validate(updateUserPasswordValidation),
  updateUserPassword
);
userRouter
  .route("/:userId")
  .get(verifyToken(), validate(userIdValidation), getUser)
  .put(verifyToken(), validate(userUpdateValidation), updateUser)
  .delete(verifyToken(), validate(userIdValidation), deleteUser);
userRouter.get(
  "/profile/:userId",
  verifyToken(),
  validate(userIdValidation),
  getProfileDataForAnotherUser
);

export default userRouter;
