const mongoose = require("mongoose");

// ------- Define schema ------- //
// Problem
const problemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    }, 
    reported_by:{
        type: String,
        required: true,
        trim: true
    }
});

// ------- Create model ------- //
const Problem = mongoose.model("Problem", problemSchema);

// Export model
module.exports = Problem;