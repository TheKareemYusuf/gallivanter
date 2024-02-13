const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Subject name is required"],
  },
});

const Subject = mongoose.model("Subject", SubjectSchema);

module.exports = Subject;
