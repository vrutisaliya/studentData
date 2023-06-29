const fs = require("fs");
const path = require("path");

// Function to upload image and return Base64 format
const uploadImage = async (imageFile) => {
  try {
    // Generate unique filename
    const filename = `${Date.now()}-${imageFile.originalname}`;
    const imagePath = path.join(__dirname, "../uploads", filename);

    // Save the image file
    await fs.promises.writeFile(imagePath, imageFile.buffer);

    // Read the image file as Base64
    const base64Image = await fs.promises.readFile(imagePath, "base64");

    // Delete the uploaded image file from the server
    await fs.promises.unlink(imagePath);

    return base64Image;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};

module.exports = { uploadImage };
