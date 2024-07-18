import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import {
  GetAllJobsWithCompanyDetails,
  addJob,
  deleteJob,
  getAllJobsForSpecificCompany,
  getAllJobsMatchFilter,
  updateJob,
} from "./job.controllers.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { validate } from "../../middlewares/validate.js";
import {
  addJobValidation,
  filterJobsValidation,
  jobIdValidation,
  updateJobValidation,
} from "./job.validation.js";
import { checkJobIdExists } from "./job.middlewares.js";
import { companyNameValidation } from "../Company/company.validation.js";

const jobRouter = Router();
jobRouter
  .route("/")
  .get(
    verifyToken(),
    checkRole(["User", "Company_HR"]),
    GetAllJobsWithCompanyDetails
  )
  .post(
    verifyToken(),
    checkRole(["Company_HR"]),
    validate(addJobValidation),
    addJob
  );

jobRouter
  .route("/getAllJobsForSpecificCompany")
  .get(
    verifyToken(),
    checkRole(["Company_HR", "User"]),
    validate(companyNameValidation),
    getAllJobsForSpecificCompany
  );

jobRouter
  .route("/getAllJobsMatchFilter")
  .get(
    verifyToken(),
    checkRole(["Company_HR", "User"]),
    validate(filterJobsValidation),
    getAllJobsMatchFilter
  );

jobRouter
  .route("/:jobId")
  .put(
    verifyToken(),
    checkRole(["Company_HR"]),
    validate(updateJobValidation),
    checkJobIdExists,
    updateJob
  )
  .delete(
    verifyToken(),
    checkRole(["Company_HR"]),
    validate(jobIdValidation),
    checkJobIdExists,
    deleteJob
  );

export default jobRouter;
