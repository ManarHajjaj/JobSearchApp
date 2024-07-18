import { catchError } from "../middlewares/catchError.js";
import { AppError } from "../utils/appError.js";

export const verifyUserToResetPassword = catchError(async (req, res, next) => {
  const userId = req.user.userId;
  if (userId !== req.params.userId)
    return next(
      new AppError(
        "You're not authorized to change password of another user",
        403
      )
    );
  next();
});
