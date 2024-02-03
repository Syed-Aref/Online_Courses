const mongoose = require("mongoose");

// ------- Define schema ------- //
// OTP
const otpSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60, //1 hour
    }
  });

// ------- Create model ------- //
const OTP = mongoose.model("OTP", otpSchema);

// Export model
module.exports = OTP;