const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // removes any leading/trailing spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures email is unique for each admin
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'], // Email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  uploadedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the Course model
  }],
  registrationDate: {
    type: Date,
    default: Date.now, // Automatically set registration date
  }
});

// Compile schema into a model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
