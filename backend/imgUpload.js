// imgUpload.js

const multer = require("multer");

// Define the storage configuration for multer
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  // Set the filename for uploaded files
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

// Initialize the upload middleware
const upload = multer({ storage });

// Export the upload middleware
module.exports = { upload };
