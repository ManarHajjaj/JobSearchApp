import User from "../../database/models/user.model.js";

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
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await User.updateOne({ email }, { password: hashedPassword, otp: null, otpExpiresAt: null });
  };