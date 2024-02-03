const mongoose = require("mongoose");

// ------- Define schema ------- //
// Lesson
const lessonSchema = new mongoose.Schema({
    file_link: {
        type: String,
        trim: true,
        default: "-0"
    },

    description: {
        type: String,
        trim: true, 
        default: "-0"
    }
});

// ------- Create model ------- //
const Lesson = mongoose.model("Lesson", lessonSchema);

// Export model
module.exports = Lesson;