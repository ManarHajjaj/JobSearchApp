//To handle exceptions
process.on("uncaughtException", (err) => {
  console.log("error in code", err);
});
import express from "express";
import "./database/dbConnection.js";
import dotenv from "dotenv";
import userRouter from "./modules/User/user.routes.js";
import { AppError } from "./utils/appError.js";
import globalError from "./middlewares/globalError.js";
import companyRouter from "./modules/Company/company.routes.js";
import jobRouter from "./modules/Job/job.routes.js";
import applicationRouter from "./modules/Application/application.routes.js";
import otpRouter from "./otp/otp.routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
const port = 3000;

app.use("/users", userRouter);
app.use("/companies", companyRouter);
app.use("/jobs", jobRouter);
app.use("/applications", applicationRouter);
app.use("/password", otpRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`route not found ${req.originalUrl}`, 404));
});

//global error handling middleware
app.use(globalError);

// to handle all errors outside express
process.on("unhandledRejection", (err) => {
  console.log("error", err);
});
app.listen(port, () => console.log(`app is running on port ${port}!`));
