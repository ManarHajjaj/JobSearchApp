import Job from "../../database/models/job.model.js";
import { AppError } from "../../utils/appError.js";

export const checkJobIdExists = async (req, res, next) => {
  const jobId = req.params.jobId;
  const job = await Job.findById(jobId);
  if (!job) return next(new AppError("This Job doesn't Exist", 404));
  next();
};
