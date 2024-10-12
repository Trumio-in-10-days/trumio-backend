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
  applicants: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
    }
  ],
  assignedStudents: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
    }
  ],
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  startDate: {
    type: Date,
    default: Date.now, 
  },
  expectedDeadline: {
    type: Date,
    required: true
  },
  progress: [
    {
      weekNumber: {
        type: Number,
        required: true
      },
      progressDescription: {
        type: String,
        required: true,
        trim: true
      }
    }
  ]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
