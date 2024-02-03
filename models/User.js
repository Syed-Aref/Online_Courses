const mongoose = require("mongoose");

// ------- Define schema ------- //
// User
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

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
    },

    fullname: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        required: true,
        trim: true
    }, 

    country: {
        type: String,
        required: true,
        trim: true
    },

    courses: [{
        type: String, 
    }],

    socials:{
        type: [String], 
        default: ["", "", ""]
    }, 

    registered: {
        type: String,
        default: "no"
    },

    twostep: {
        type: String,
        default: "no"
    }, 

    cart: [{
        type: String, 
    }]
});

// ------- Create model ------- //
const User = mongoose.model("User", userSchema);

// Export model
module.exports = User;