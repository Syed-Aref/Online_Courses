const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dgnmqadd7",
  api_key: "283245371967865",
  api_secret: "mSTcQTflrLDXYOA2M8xbSksW_xM",
});

// Instance of cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,

  /// allowedFormats: ["jpg", "png"],
  params: {
    folder: "nodejs",
    /// transformation: [{ width: 500, height: 500, crop: "limit" }],
  }
});

module.exports = storage;
