const mongoose = require('mongoose');

// Define the Student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // assuming you have a Course model
  }],
  projects:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    
  },
  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'    
  }],
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  isAlumni: {
    type: Boolean,
    default: false,
  },
  skills: {
    type: [String], // array of strings
    default: [], // empty array if not provided
  }
});

// Compile schema into a model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
