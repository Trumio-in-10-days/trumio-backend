const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  skills: {
    type: [String],
    required: true,
    default: [],
  },
  applicants:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    // validate: [arrayLimit, 'A project can not have more than 2 students'],
  }],
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  startDate: {
    type: Date,
    default: Date.now, 
  },
});

function arrayLimit(val) {
  return val.length <= 2;
}

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
