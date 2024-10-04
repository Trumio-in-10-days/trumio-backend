const bcrypt = require('bcrypt');
require('dotenv').config();
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
        // const project
        // const courses = await Course.find();
        // console.log(courses);
        const projects = await Project.find({
            assignedBy: req.id,
        }).populate('assignedStudents');
    
        res.status(200).json({ projects });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
}

exports.getAllOpenProjects = async (req,res) => {
    try {
        const projects = await Project.find().populate('assignedStudents');
        const reqProjects = projects.filter(prj => prj.assignedStudents.length==0 || (prj.assignedStudents.length==1 && prj.assignedStudents[0].isAlumni===true));
    
        res.status(200).json({ reqProjects });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
}