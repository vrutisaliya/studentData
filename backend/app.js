require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const connectDB = require("./db");
//const imgRouter = require("./imgUpload");
const routes = require("./router/router");
const usersPost = require("./controllers/users");
const studentPost = require("./controllers/studentController");

const app = express();
const path = require("path");
const cors = require("cors");
app.use(bodyParser.json({ limit: '5mb' }));

// Connect to MongoDB
connectDB();

// Configure session middleware
app.use(
  session({
    secret: "vrutisaliya123",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors({
  // origin: "http://localhost:3000",
}));
// Routes
app.use(usersPost);
app.use(studentPost);
app.use(routes);
//app.use(imgRouter);

// Multer file upload destination
const uploadDest = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDest));

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
