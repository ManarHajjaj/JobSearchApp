import Company from "../../database/models/company.model.js";
import { AppError } from "../../utils/appError.js";

// check if companyId exists
export const checkCompanyExists = async (req, res, next) => {
  const companyId = req.params.companyId;
  const company = Company.findById(companyId);
  if (!company) return next(new AppError("This Company doesn't exist", 404));
  next();
};
