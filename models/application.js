const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  }, 
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  projectTitle: {
    type: String,
    required: true,
    trim: true
  },
  projectDescription: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  expectedDeadline: {
    type: Date,
    required: true
  },
  weeklyProgress: [
    {
      weekNumber: { type: Number }, // Making this optional, as week numbers can be inferred
      progressDescription: { type: String, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  contactNumber: {
    type :String
  }
  ,
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId, // Assuming this will refer to a user or admin
    ref: 'Admin', // Assuming 'User' or some other collection holds this data
    required: true
  }
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
