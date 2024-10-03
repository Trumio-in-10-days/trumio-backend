const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Admin = require('../models/admin');
const Course = require('../models/course');

const JWT_SECRET = 'yourSecretKey';

exports.uploadCourse = async (req, res) => {
  try {
    const { title, description, skills, link  } = req.body;
    // console.log(req.body);

    // let student = await Student.findOne({ email });
    // if (student) {
    //   return res.status(400).json({ msg: 'Student already exists' });
    // }

    const course = new Course({
      title,
      description,
      skills,
      courseLink: link,
    });
    await course.save();
    console.log(course);

    res.status(201).json({ msg: "Course Uploaded successfully!" });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.completeCourse = async (req, res) => {
    try {
      const { _id  } = req.body;
      console.log(req.body);
    //   let token = req.body.token ;
  
    //   jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    //     console.log(decodedToken);
    //     if (err) {
    //       console.log(err);
    //       return res.status(401).json({ message: "Not authorized" })
    //     } else {  
    //       req.id = decodedToken.id;
    //       return  next();
    //     }
    //   })
    const student = await Student.findById('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmU0YmI0NjdjMDM2ODMxZGQ3M2VhMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNzk0MTYyNiwiZXhwIjoxNzI3OTQ1MjI2fQ.76BIvoeDx6wI62KgY_6FTyWsYLMnHroDM0PLHMJzJAQ');
    const course = await Course.findById(_id);
    console.log(student);
    console.log(course);
    if(!student.enrolledCourses.includes(course)){
        student.enrolledCourses.push(course);
        student.skills = [...new Set([...student.skills, ...course.skills])];
        await student.save();
    }
  
      res.status(200).json({ msg: "Course completed successfully!" });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };

exports.getAllCourses = async (req, res) => {
    try {
  
      const courses = await Course.find();
      console.log(courses);
  
      res.status(201).json({ courses });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };

