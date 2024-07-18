import { catchError } from "../../middlewares/catchError.js";
import Job from "../../database/models/job.model.js";
import Company from "../../database/models/company.model.js";
import { AppError } from "../../utils/appError.js";

export const addJob = catchError(async (req, res) => {
  const newAddedJob = await Job.create(req.body);
  res
    .status(201)
    .json({ message: "New Job is added successfully", newAddedJob });
});

export const updateJob = catchError(async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
    new: true,
  });
  res.status(200).json({ message: "Job is updated successfully", updatedJob });
});

export const deleteJob = catchError(async (req, res) => {
  const deletedJob = await Job.findByIdAndDelete(req.params.jobId);
  res.status(200).json({ message: "Job is deleted successfully", deletedJob });
});

export const GetAllJobsWithCompanyDetails = catchError(async (req, res) => {
  let updatedJobs = [];
  const Jobs = await Job.find();
  for (const job of Jobs) {
    const companies = await Company.find({ companyHR: job.addedBy });
    const updatedJob = { ...job._doc, companies };
    updatedJobs.push(updatedJob);
  }
  res.status(200).json({
    message: "Jobs with company Information are retrieved successfully",
    result: updatedJobs,
  });
});

export const getAllJobsForSpecificCompany = catchError(async (req, res) => {
  const companyName = req.query.companyName;
  const company = await Company.findOne({ companyName });

  if (!company) return next(new AppError("This company doesn't exist", 404));
  const Jobs = await Job.find({ addedBy: company.companyHR });
  res.status(200).json({
    message: `All Jobs for ${companyName} are retrieved successfully`,
    Jobs,
  });
});

export const getAllJobsMatchFilter = catchError(async (req, res) => {
  const filters = req.body;
  const query = {};
  if (filters.workingTime) {
    query.workingTime = filters.workingTime;
  }
  if (filters.jobLocation) {
    query.jobLocation = filters.jobLocation;
  }
  if (filters.seniorityLevel) {
    query.seniorityLevel = filters.seniorityLevel;
  }
  if (filters.jobTitle) {
    query.jobTitle = filters.jobTitle;
  }
  if (filters.technicalSkills) {
    query.technicalSkills = { $in: filters.technicalSkills };
  }

  const result = await Job.find(query);
  if (!result) {
    return next(new AppError("No Jobs are matching filters are found", 404));
  }
  res.status(200).json({
    message: "All Jobs that match Filters are retrieved successfully",
    result,
  });
});
