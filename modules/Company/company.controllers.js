import Company from "../../database/models/company.model.js";
import Job from "../../database/models/job.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { AppError } from "../../utils/appError.js";
import { ObjectId } from "mongodb";

// Add Company
export const addCompany = catchError(async (req, res, next) => {
  const newAddedCompany = await Company.create(req.body);
  res
    .status(201)
    .json({ message: "New Company is added successfully", newAddedCompany });
});

// Update Company
export const updateCompany = catchError(async (req, res, next) => {
  const userId = new ObjectId(req.user.userId); // Access userId from req.user
  const companyId = req.params.companyId;
  const company = await Company.findById(companyId);
  const companyHRId = company.companyHR;

  // check the user making the request is the owner of the company
  if (!companyHRId.equals(userId)) {
    return next(
      new AppError(
        "Unauthorized - You are not allowed to perform this action beacuse you're not the owner of this Company",
        403
      )
    );
  }
  const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, {
    new: true,
  });
  res
    .status(200)
    .json({ message: "Company is updated successfully", updatedCompany });
});

// Delete Company
export const deleteCompany = catchError(async (req, res, next) => {
  const userId = new ObjectId(req.user.userId); // Access userId from req.user
  const companyId = req.params.companyId;
  const company = await Company.findById(companyId);
  const companyHRId = company.companyHR;

  // check the user making the request is the owner of the company
  if (!companyHRId.equals(userId)) {
    return next(
      new AppError(
        "Unauthorized - You are not allowed to perform this action beacuse you're not the owner of this Company",
        403
      )
    );
  }

  await Company.findByIdAndDelete(companyId);
  res.status(200).json({ message: "Company is deleted successfully" });
});

//Search for a company with a name
export const searchCompanyByName = catchError(async (req, res, next) => {
  const companyName = req.params.companyName;
  const FoundCompany = await Company.find({ companyName });

  if (!FoundCompany) {
    return next(new AppError("No Company is found by this name", 404));
  }
  res.status(200).json({
    message: `${companyName} data is retrieved successfully`,
    FoundCompany,
  });
});

// get company Data with Jobs
export const getCompanyData = catchError(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  const jobs = await Job.find({ addedBy: company.companyHR });
  res.status(200).json({
    message: "Company data and related jobs are retrieved successfully",
    company,
    jobs,
  });
});
