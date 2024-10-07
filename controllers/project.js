const bcrypt = require("bcrypt");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Project = require("../models/project");
const Admin = require("../models/admin");
const Course = require("../models/course");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Application =require("../models/application");
 
const JWT_SECRET = "yourSecretKey";

exports.addProject = async (req, res) => {
  console.log(req.body);
  try {
    const { title, description, expectedDeadline } = req.body;
   
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `The project with title: ${title}. The description is: ${description}. Give me top 5 tech stacks to complete this project in 5 words separated by (,).`;

    const result = await model.generateContent(prompt);
    const { token } = req.body;
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      // console.log(decodedToken);
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Not authorized" });
      } else {
        req.id = decodedToken.id;
      }
    });
    const project = new Project({
      title,
      description,
      assignedBy: req.id,
      skills: result.response.text().split(","),
      expectedDeadline,
    });
    console.log(project);
    await project.save();
  return  res.status(200).json({ project });
  } catch (err) {
   return res.status(500).json({ msg: "Server error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Not authorized" });
      } else {
        req.id = decodedToken.id;
      }
    }); 

    const projects = await Project.find({
      assignedBy: mongoose.Types.ObjectId.createFromHexString(req.id),
    });
   
    return res.status(200).json({ projects });
  } catch (err) {
    console.log(err);
  return   res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllOpenProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("assignedStudents")
      .populate("assignedBy");
    const reqProjects = projects.filter(
      (prj) =>
        prj.assignedStudents.length == 0 ||
        (prj.assignedStudents.length == 1 &&
          prj.assignedStudents[0].isAlumni === true)
    );
    
 return   res.status(200).json({ reqProjects });
  } catch (err) {
    return  res.status(500).json({ msg: "Server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { project_id } = req.body;
    const project = await Project.findById(project_id)
      .populate("assignedStudents")
      .populate("assignedBy")
      .populate("applicants");
     

   return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.applyProject = async (req, res) => {
  try {
    const { projectId, token, student_id, application_id } = req.body;

    // Find the project by projectId
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify the JWT token
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        req.id = decodedToken.id;
      }
    });

    // Find the student by ID
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const application = await Application.findById(application_id);
    application.status = "approved";
    application.save();
    // Push the student and application into the assignedStudents array in the project
    project.assignedStudents.push({
      student: student_id,
      application: application_id,
    });
  
    // Push the project and application ID into the student's projects array
    student.projects.push({
      project: projectId,
      application: application_id,
    });

    // Remove the student from the applicants array in the project
    project.applicants = project.applicants.filter(
      (applicant) => applicant.student && applicant.student.toString() !== student_id.toString()
    );
    
    // Save the updated project and student data
    await project.save();
    await student.save();

    return res.status(200).json({ message: "Student assigned to project successfully", project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};
exports.getAppliedAndAssignedProjects = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify JWT token
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        req.id = decodedToken.id;
      }
    });

    // Fetch projects where the student is either in the applicants or assignedStudents array
    const projects = await Project.find({
      $or: [
        { 'applicants.student': req.id },        // Applied projects
        { 'assignedStudents.student': req.id }   // Assigned projects
      ]
    }).populate('assignedBy');

    // Filter out the applied and assigned projects
    const appliedProjects = projects.filter(project =>
      project.applicants.some(applicant => applicant.student.toString() === req.id)
    );

    const assignedProjects = projects.filter(project =>
      project.assignedStudents.some(student => student.student.toString() === req.id)
    );

    return res.status(200).json({
      appliedProjects,
      assignedProjects
    });
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};


exports.selectStudentsforProject = async (req, res) => {
  try {
    const { projectId, studentId } = req.body;
    const project = await Project.findById(projectId).populate(
      "assignedStudents"
    );
    const student = await Student.findById(studentId);
    if (project.assignedStudents.length === 0) {
      project.assignedStudents.push(student._id);
      await project.save();
      student.projects.push(project._id);
      await student.save();
    } else if (
      project.assignedStudents.length === 1 &&
      project.assignedStudents[0].isAlumni !== student.isAlumni
    ) {
      project.assignedStudents.push(student, _id);
      await project.save();
      student.projects.push(project._id);
      await student.save();
    } else {
      res.status(403).json({ msg: "Not possible" });
    }

   return  res.status(200).json({ student });
  } catch (err) {
    console.log(err);
   return  res.status(500).json({ msg: "Server error" });
  }
};
