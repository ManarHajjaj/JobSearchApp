import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  addApplication,
  downloadExcelSheet,
  getAllApplicationForSpecificJob,
  getAllApplications,
} from "./application.controllers.js";
import { validate } from "../../middlewares/validate.js";
import { applicationIdValidation } from "./application.validation.js";

const applicationRouter = Router();
applicationRouter
  .route("/")
  .get(verifyToken(), getAllApplications)
  .post(verifyToken(), checkRole(["User"]), addApplication);

applicationRouter
  .route("/:jobId")
  .get(
    verifyToken(),
    checkRole(["Company_HR"]),
    validate(applicationIdValidation),
    getAllApplicationForSpecificJob
  );
applicationRouter
  .route("/downloadExcel")
  .post(verifyToken(), downloadExcelSheet);
export default applicationRouter;
