import User from "../database/models/user.model.js";
import { catchError } from "../middlewares/catchError.js";
import { sendEmail } from "../email/otpEmail.js";
import bcrypt from "bcrypt";

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  return otp;
};

export const saveOTPToUser = async (email) => {
  const otp = generateOTP();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  await User.updateOne({ email }, { otp, otpExpiresAt: expirationTime });

  return otp;
};

const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email }).exec();
  if (user && user.otp === otp && user.otpExpiresAt > Date.now()) {
    return true;
  }
  return false;
};

const updatePassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.updateOne(
    { email },
    { password: hashedPassword, otp: null, otpExpiresAt: null }
  );
};

// Forget password
export const requestPasswordReset = catchError(async (req, res) => {
  const { email } = req.body;
  const otp = await saveOTPToUser(email);
  await sendEmail(email, otp);
  res.status(200).send("OTP sent to email.");
});

// resetPassword
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const isOTPValid = await verifyOTP(email, otp);
  if (isOTPValid) {
    await updatePassword(email, newPassword);
    res.status(200).send("Password updated successfully.");
  } else {
    res.status(400).send("Invalid or expired OTP.");
  }
};
