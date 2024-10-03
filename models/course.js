const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  courseLink: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL'],
  },
  skills: {
    type: [String],
    required: true,
    default: [],
  },
  uploadedDate: {
    type: Date,
    default: Date.now,
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
