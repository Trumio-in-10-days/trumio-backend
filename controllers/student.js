const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Project = require('../models/project');
const Admin = require('../models/admin');
const Course = require('../models/course');

const JWT_SECRET = 'yourSecretKey';


exports.findProjectPair = async(req, res) => {
    try{
        const {name} = req.body;
        const student = await Student.findOne({name});
        const alumniWithCommonSkill = await Student.find({
            isAlumni:true,
            skills: { $in: student.skills },
          });
          const alumniWithSkillCounts = alumniWithCommonSkill.map((alumni) => {
            const commonSkills = alumni.skills.filter((skill) => student.skills.includes(skill)); // Find matching skills
            return {
              name: alumni.name,
              commonSkills: commonSkills,
            };
          });
          res.status(200).json({ alumniWithSkillCounts });
    }catch(err){
        res.status(500).json({ msg: 'Server error' });
    }
}

exports.PairforProject = async(req, res) => {
    try{
        const {studentName, alumniName, description} = req.body;
        // console.log(req.body);
        const student = await Student.findOne({name: studentName});
        const alumni = await Student.findOne({name: alumniName});
        const project = new Project({
            description,
            assignedStudents:[student, alumni],
        });
        console.log(project);
        student.projects.push(project);
        await student.save();
        alumni.projects.push(project);
        await alumni.save();
        res.status(200).json({ project });
    }catch(err){
        res.status(500).json({ msg: 'Server error' });
    }
}

exports.getAllStudents = async (req, res) => {
    try {
  
      const students = await Student.find({isAlumni:false});
  
      res.status(201).json({ students });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };

  exports.getStudent = async (req, res) => {
    try {
        let token = req.body.token ;
        let student;
  
        jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
          console.log(decodedToken);
          if (err) {
            console.log(err);
            return res.status(401).json({ message: "Not authorized" })
          } else {  
            req.id = decodedToken.id;
          }
        })
        student = await Student.findById(req.id).populate('enrolledCourses').populate('projects');
        console.log(student);
    res.status(201).json({ student });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };

  exports.updateSkill = async(req, res) => {
    try {
        const {skill, id, action} = req.body;
        if(action==='add'){
            await Student.updateOne(
                { _id: id },
                { $addToSet: { skills: skill } }
              );
        }else{
            await Student.updateOne(
                { _id: id },
                { $pull: { skills: skill } }
              );
        }


    res.status(200).json({ msg: "Success" });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }

