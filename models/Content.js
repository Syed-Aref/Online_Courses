const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    lessons: {
        type: [String], 
        default: []
    }
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;