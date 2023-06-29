// users.js
const multer = require("multer");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateName,

  validateEmail,
  validatePasswordMatch,
  validateMobileNumber,
} = require("../utils/validator");

const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Get all users API endpoint
router.get("/users", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.find(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    req.session.users = user;
    console.log(req.session.users);
    res.json({
      status: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});
// Get single user API endpoint
router.get("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    req.session.users = user;
    console.log(req.session.users);
    res.json({
      status: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Update user API endpoint
router.put("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, mobileNumber } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName,
          lastName,
          email,
          mobileNumber,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    req.session.users = user;
    console.log(req.session.users);
    res.json({
      status: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Sign-in API endpoint
router.post("/api/v1/school/signin", async (req, res) => {
  try {
    const { email, password, mobileNumber } = req.body;

    // Validation checks
    if (mobileNumber) {
      validateMobileNumber(mobileNumber);
    }
    validateEmail(email);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password.");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    const expiresIn = new Date(Date.now() + 4 * 60 * 60 * 1000);

    // Store data in session storage
    req.session.user = {
      userId: user._id,
      email: user.email,
    };
    console.log(req.session.user);
    res.json({
      status: true,
      message: "User signed in successfully.",
      token,

      userId: user._id,
      expiresIn, // Include the user ID in the response
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});
// Delete user API endpoint
router.delete("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

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
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    cb(null, filename);
  },
});

//const upload = multer({ storage: storage });

// Signup API endpoint

router.post("/api/v1/school/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      mobileNumber,
      profileImage,
    } = req.body;

    // Validation checks
    validateName(firstName);
    validateName(lastName);
    validateEmail(email);
    validatePasswordMatch(password, confirmPassword);
    validateMobileNumber(mobileNumber);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
      profileImage,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      status: true,
      message: "User created successfully.",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
