const bcrypt = require('bcrypt');
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Project = require('../models/project');
const Admin = require('../models/admin');
const Course = require('../models/course');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const JWT_SECRET = 'yourSecretKey';

exports.addProject = async (req,res) => {
    try {
        const {title,description} = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `The project with title: ${title}. The description is: ${description}. Give me top 5 tech stacks to complete this project in 5 words separated by (,).`;

        const result = await model.generateContent(prompt);
        const {token} = req.body;
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            // console.log(decodedToken);
            if (err) {
              console.log(err);
              return res.status(401).json({ message: "Not authorized" })
            } else {  
              req.id = decodedToken.id;
            }
          })
        const project = new Project({
            title,
            description,
            assignedBy: req.id,
            skills: result.response.text().split(','),
        });
        await project.save();
        res.status(200).json({ project });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
}

exports.getProjects = async (req,res) => {
    try {
        const {token} = req.body;
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            // console.log(decodedToken);
            if (err) {
              console.log(err);
              return res.status(401).json({ message: "Not authorized" })
            } else {  
              req.id = decodedToken.id;
            }
          })

        const projects = await Project.find({
            assignedBy:  mongoose.Types.ObjectId.createFromHexString(req.id),
        });
    
        res.status(200).json({ projects });
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
      }
}

exports.getAllOpenProjects = async (req,res) => {
    try {
        const projects = await Project.find().populate('assignedStudents').populate('assignedBy');
        const reqProjects = projects.filter(prj => prj.assignedStudents.length==0 || (prj.assignedStudents.length==1 && prj.assignedStudents[0].isAlumni===true));
        // await reqProjects.populate('assignedBy');
    
        res.status(200).json({ reqProjects });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
}

exports.getProjectById = async (req,res) => {
  try {
    const {project_id} = req.body;
      const project = await Project.findById(project_id).populate('assignedStudents').populate('assignedBy').populate("applicants");
      // const reqProjects = projects.filter(prj => prj.assignedStudents.length==0 || (prj.assignedStudents.length==1 && prj.assignedStudents[0].isAlumni===true));
      // await reqProjects.populate('assignedBy');
  
      res.status(200).json({ project });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
}

exports.applyProject = async (req,res) => {
    try {
        const {projectId, token} = req.body;
        const project = await Project.findById(projectId);
        // console.log(project);
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            // console.log(decodedToken);
            if (err) {
              console.log(err);
              return res.status(401).json({ message: "Not authorized" })
            } else {  
              req.id = decodedToken.id;
            }
          })
        project.applicants.push(mongoose.Types.ObjectId.createFromHexString(req.id));
        await project.save();
    
        res.status(200).json({ project });
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
      }
}

exports.getAppliedProjecs = async (req,res) => {
  try {
      const {token} = req.body;
      
      // console.log(project);
      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
          // console.log(decodedToken);
          if (err) {
            console.log(err);
            return res.status(401).json({ message: "Not authorized" })
          } else {  
            req.id = decodedToken.id;
          }
        })
        const projects = await Project.find({
          applicants: { $in: [req.id] }
        }).populate('assignedBy');
  
      res.status(200).json({ projects });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'Server error' });
    }
}

exports.selectStudentsforProject = async (req,res) => {
  try {
      const {projectId, studentId} = req.body;
      const project = await Project.findById(projectId).populate('assignedStudents');
      const student = await Student.findById(studentId);
      if(project.assignedStudents.length===0){
        project.assignedStudents.push(student._id);
        await project.save();
        student.projects.push(project._id);
        await student.save();
      }else if(project.assignedStudents.length===1 && project.assignedStudents[0].isAlumni!==student.isAlumni){
        project.assignedStudents.push(student,_id);
        await project.save();
        student.projects.push(project._id);
        await student.save();
      }else{
        res.status(403).json({ msg:"Not possible" });
      }
  
      res.status(200).json({ student });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'Server error' });
    }
}