const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const Student = require("../models/Student");
const {
  validateStander,
  validateAge,
  validateName,
  validateEmail,
  validateGender,
  validateMobileNumber,
} = require("../utils/StudentValidation");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Specify the folder where you want to save the uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

// Add student
router.post(
  "/api/v1/school/student/add",
  authenticate,

  async (req, res) => {
    try {
      // Extract student data from request body
      const {
        firstName,
        lastName,
        stander,
        email,
        mobileNumber,
        age,
        gender,
        profilePicture,
      } = req.body;

      // Validation

      validateName(firstName);
      validateName(lastName);
      validateStander(stander);

      validateEmail(email);
      validateMobileNumber(mobileNumber);

      validateAge(age);
      validateGender(gender);

      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        throw new Error("Email already exists.");
      }

      // Create a new student instance
      const student = new Student({
        firstName,
        lastName,
        stander,
        email,
        mobileNumber,
        age,
        gender,
        profilePicture,
      });

      // Save the student to the database
      await student.save();

      res.status(201).json({ student });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all students

// Update student
router.put(
  "/api/v1/school/student/update/:id",
  authenticate,
  async (req, res) => {
    try {
      // Extract student data from request body
      const {
        studentid,
        firstName,
        lastName,
        stander,
        email,
        mobileNumber,
        age,
        gender,
        profilePicture,
      } = req.body;
      const studentId = req.params.id;

      // Find the student by ID and update the fields
      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        {
          studentid,
          firstName,
          lastName,
          stander,
          email,
          mobileNumber,
          age,
          gender,
          profilePicture,
        },
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({
          status: false,
          message: "Student not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Student updated successfully",
        student: updatedStudent,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to update student",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/api/v1/school/student/delete/:id",
  authenticate,
  async (req, res) => {
    const { id } = req.params;

    try {
      const user = await Student.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      res.json({
        status: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
);
// Get all students with pagination and search
router.get("/api/v1/school/student/all", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    };

    // Find students matching the search query
    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Count total number of students matching the search query
    const totalStudents = await Student.countDocuments(query);

    res.status(200).json({
      status: true,
      message: "Students retrieved successfully",
      students,
      totalStudents,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve students",
      error: error.message,
    });
  }
});

// Get student by ID
router.get("/api/v1/school/student/:id", authenticate, async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Student retrieved successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve student",
      error: error.message,
    });
  }
});

module.exports = router;
