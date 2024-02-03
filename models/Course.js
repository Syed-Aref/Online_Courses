const mongoose = require("mongoose");

// ------- Define schema ------- //
// Course
const courseSchema = new mongoose.Schema({
    cid: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

    title: {
        type: String,
        required: true,
        trim: true, 
    },

    creator: {
        type: String,
        required: true,
        trim: true, 
    },

    students: [{
        type: String, 
    }], 

    contents: {
        type: [String], 
        default: []
    }, 

    charge: {
        type: Number, 
        default: 0
    }, 

    discount: {
        type: Number,
        default: 0
    }, 

    revenue: {
        type: Number,
        default: 0
    }
});

// ------- Create model ------- //
const Course = mongoose.model("Course", courseSchema);

// Export model
module.exports = Course;