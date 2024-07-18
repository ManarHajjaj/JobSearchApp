import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  getCompanyData,
  addCompany,
  deleteCompany,
  searchCompanyByName,
  updateCompany,
} from "./company.controllers.js";
import { validate } from "../../middlewares/validate.js";
import {
  addCompanyValidation,
  companyIdValidation,
  companyNameValidation,
  updateCompanyValidation,
} from "./company.validation.js";
import { checkCompanyExists } from "./company.middlewares.js";

const companyRouter = Router();

companyRouter
  .route("/")
  .post(
    verifyToken(),
    checkRole(["Company_HR"], validate(addCompanyValidation)),
    addCompany
  );

companyRouter
  .route("/search/:companyName")
  .get(
    verifyToken(),
    checkRole(["Company_HR", "User"], validate(companyNameValidation)),
    searchCompanyByName
  );

companyRouter
  .route("/getCompanyData/:companyId")
  .get(
    verifyToken(),
    checkRole(["Company_HR"]),
    validate(companyIdValidation),
    checkCompanyExists,
    getCompanyData
  );

companyRouter
  .route("/:companyId")
  .put(
    verifyToken(),
    checkRole(["Company_HR"]),
    validate(updateCompanyValidation),
    checkCompanyExists,
    updateCompany
  )
  .delete(
    verifyToken(),
    checkRole(["Company_HR"]),
    validate(companyIdValidation),
    checkCompanyExists,
    deleteCompany
  );

export default companyRouter;
