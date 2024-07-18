import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import Application from "../../database/models/application.model.js";
import Job from "../../database/models/job.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { AppError } from "../../utils/appError.js";
import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const getAllApplications = catchError(async (req, res) => {
  const applications = await Application.find();
  res
    .status(200)
    .json({ message: "Applications are retrieved successfully", applications });
});
export const getAllApplicationForSpecificJob = catchError(
  async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user.userId;

    // find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new AppError("Job is not found", 404));
    }
    if (job.addedBy.toString() !== userId) {
      return next(
        new AppError(
          "Unauthorized, You are not allowed to view applications for this job",
          403
        )
      );
    }

    // Find all applications for the job and populate user data
    const applications = await Application.find({ job: jobId }).populate(
      "userId"
    );

    res.status(200).json({
      message: "Applications for the job are retrieved successfully",
      applications,
    });
  }
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

// Multer file filter for accepting only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new AppError("Only PDF files are allowed.", 400), false);
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB
};

// Multer upload instance
const upload = multer({ storage, fileFilter, limits });

export const addApplication = catchError(async (req, res, next) => {
  // Multer middleware to handle file upload
  upload.single("userResume")(req, res, async (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }

    // Access form fields and uploaded file details
    const { jobId, userId, userTechSkills, userSoftSkills } = req.body;
    const resume = req.file;

    // Create a new application
    const newApplication = new Application({
      jobId,
      userId,
      userTechSkills,
      userSoftSkills,
      userResume: {
        name: resume.originalname,
        path: resume.path,
      },
    });

    // Save the application to the database
    await newApplication.save();

    return res
      .status(200)
      .json({ message: "Application submitted successfully" });
  });
});

export const downloadExcelSheet = catchError(async (req, res, next) => {
  const applications = await Application.find({});
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  // Add headers to the Excel sheet
  worksheet.addRow(["userId", "jobId", "userTechSkills", "userSoftSkills"]);

  // Add data rows to the Excel sheet
  applications.forEach((application) => {
    worksheet.addRow([
      application.userId,
      application.jobId,
      application.userTechSkills,
      application.userSoftSkills,
    ]);
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Generate a unique filename based on the current timestamp
  const fileName = `applications-${Date.now()}.xlsx`;
  const filePath = path.join(__dirname, "excelFiles", fileName);

  // Write the Excel file with the generated filename
  await workbook.xlsx.writeFile(filePath);

  // Set headers for download response
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  // Send the Excel file as a download response
  res.sendFile(filePath);
});
