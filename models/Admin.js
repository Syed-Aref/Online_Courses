const mongoose = require("mongoose");

// ------- Define schema ------- //
// Admin
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        trim: true
    }
});

// ------- Create model ------- //
const Admin = mongoose.model("Admin", adminSchema);

// Export model
module.exports = Admin;