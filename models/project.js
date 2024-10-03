const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    validate: [arrayLimit, 'A project must have exactly 2 students'],
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
  return val.length === 2;
}

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
