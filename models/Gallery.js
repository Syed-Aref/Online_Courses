const mongoose = require("mongoose");

// ------- Define schema ------- //
// Gallery
const GallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// ------- Create model ------- //
const Gallery = mongoose.model("Gallery", GallerySchema);

// Export model
module.exports = Gallery;
