import bcrypt from "bcryptjs";
import User from "../../database/models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmails } from "../../email/email.js";
import { catchError } from "../../middlewares/catchError.js";
import { AppError } from "../../utils/appError.js";

//signUp
export const signUp = catchError(async (req, res, next) => {
  const { email, password, ...otherFields } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists", 401));
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  await User.create({ ...otherFields, email, password: hashedPassword });
  sendEmails(req.body.email);

  res.status(201).json({ message: "Signed Up Successfully" });
});

//signIn
export const signIn = catchError(async (req, res, next) => {
  const { email, recoveryEmail, password, mobileNumber } = req.body;

  // get the User from db
  const user = await User.findOne({
    $or: [{ email }, { recoveryEmail }, { mobileNumber }],
  });

  // If can't find user with these credentials, or invalid password
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new AppError("Invalid Credentials", 401));
  }

  // Generate JWT token if credentials are correct
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  // Update user status to online
  user.status = "online";
  await user.save();
  res.status(200).json({ token, message: "Signed In Successfully", user });
});

//update account
export const updateUser = catchError(async (req, res, next) => {
  const { email, mobileNumber, recoveryEmail, firstName, lastName, DOB } =
    req.body;
  const userId = req.user.userId; // Access userId from req.user

  // check the user making the request is the owner of the account
  if (req.params.userId !== userId) {
    return next(
      new AppError(
        "Unauthorized - You are not allowed to perform this action",
        403
      )
    );
  }
  // check if the email doesn't exist before and if it's found it's for another user
  if (email) {
    const existingUserWithEmail = await User.findOne({ email });
    if (
      existingUserWithEmail &&
      existingUserWithEmail._id.toString() !== userId
    ) {
      return next(new AppError("Email already exists", 400));
    }
  }
  // check if the mobileNumber doesn't exist before and if it's found it's for another user
  if (mobileNumber) {
    const existingUserWithMobile = await User.findOne({ mobileNumber });
    if (
      existingUserWithMobile &&
      existingUserWithMobile._id.toString() !== userId
    ) {
      return next(new AppError("Mobile number already exists", 400));
    }
  }
  // Update user data
  const user = await User.findById(userId);
  if (!user) {
    return new next(AppError("User is not found", 404));
  }
  // Update fields if provided
  user.email = email || user.email;
  user.mobileNumber = mobileNumber || user.mobileNumber;
  user.recoveryEmail = recoveryEmail || user.recoveryEmail;
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.DOB = DOB || user.DOB;

  await user.save();
  res.status(200).json({ message: "Account updated successfully", user });
});

//Delete account
export const deleteUser = catchError(async (req, res, next) => {
  const userId = req.user.userId; // Access userId from req.user
  // check the user making the request is the owner of the account
  if (req.params.userId !== userId) {
    return next(
      new AppError(
        "Unauthorized - You are not allowed to perform this action",
        403
      )
    );
  }
  const user = await User.findByIdAndDelete(userId);
  if (!user) return next(new AppError("User is not Found", 404));
  res.status(200).json({ message: "User is deleted successfully" });
});

//Get user account data
export const getUser = catchError(async (req, res, next) => {
  const userId = req.user.userId; // Access userId from req.user
  // check the user making the request is the owner of the account
  if (req.params.userId !== userId) {
    return next(
      new AppError(
        "Unauthorized - You are not allowed to perform this action",
        403
      )
    );
  }
  const user = await User.findById(userId);
  if (!user) return next(new AppError("User is not Found", 404));
  res.status(200).json(user);
});

//Get all users
export const getAllUsers = catchError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get profile data for another user
export const getProfileDataForAnotherUser = catchError(
  async (req, res, next) => {
    const { userId } = req.params; // get userId passed in params
    // Retrieve user profile data
    const user = await User.findById(userId);
    // Check if user exists
    if (!user) {
      return next(new AppError("User is not found", 404));
    }
    // return User
    res.status(200).json({
      message: "User profile data is retrieved successfully",
      user,
    });
  }
);

// Update password
export const updateUserPassword = catchError(async (req, res, next) => {
  const password = req.body.password;
  const userId = req.user.userId; // Access userId from req.user
  // check the user making the request is the owner of the account
  if (req.params.userId !== userId) {
    return next(
      new AppError(
        "Unauthorized - You are not allowed to perform this action",
        403
      )
    );
  }
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
    },
    { new: true }
  );
  res.status(200).json({
    message: "User Password is updated successfully",
    user,
  });
});
//Get all accounts associated to a specific recovery Email
export const getAllAccountsByRecoveryEmail = catchError(
  async (req, res, next) => {
    const recoveryEmail = req.body.recoveryEmail;

    // get all users with same recovery email
    const users = await User.find({ recoveryEmail });
    if (users.length == 0)
      return next(
        new AppError("No users are Found that has the same recovery email", 404)
      );
    res.status(200).json({
      message: `Users associated with recovery email '${recoveryEmail}' are retrieved successfully`,
      users,
    });
  }
);
