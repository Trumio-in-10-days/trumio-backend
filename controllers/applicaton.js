const Application = require("../models/application"); // Import the Application model
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const JWT_SECRET = 'yourSecretKey';
const Project =require('../models/project');
exports.addApplication = async (req, res) => {
  try {
    const { projectId, projectTitle, projectDescription, startDate, expectedDeadline, weeklyProgress, token, assignedBy, contactNumber,bidAmount } = req.body;

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Not authorized" });
      } else {
        const studentId = decodedToken.id;

        // Fetch student details by ID
        const student = await Student.findById(studentId);

        // If student is not found, return an error
        if (!student) {
          return res.status(404).json({ message: "Student not found" });
        }

        const studentName = student.name;
        const email = student.email;

        // Create a new application instance
        const newApplication = new Application({
          studentName,
          email,
          projectTitle,
          projectDescription,
          startDate,
          expectedDeadline,
          weeklyProgress,
          assignedBy,
          contactNumber,
          bidAmount
        });

        // Save the application
        const savedApplication = await newApplication.save();

        // Find the project by its ID and add the student and application to the applicants array
        const project = await Project.findById(projectId);
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }

        // Add the student and application to the applicants array
        project.applicants.push({
          student: student._id,
          application: savedApplication._id
        });

        // Save the updated project
        await project.save();

        res.status(201).json({
          message: "Application successfully created and added to project applicants!",
          application: savedApplication,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.getApplication = async (req, res) => {
    try {
      const { application_id } = req.body;
  
      // Verify JWT token
       
  
      // Fetch the application by ID
      const application = await Application.findById(application_id)
        
  
      // If no application is found, return a 404 response
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      res.status(200).json({ application });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };
  