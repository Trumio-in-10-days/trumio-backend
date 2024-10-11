const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Admin = require('../models/admin');
const Course = require('../models/course');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

  
const JWT_SECRET = 'yourSecretKey'; 

exports.uploadCourse = async (req, res) => {
  try {
    const { title, description, link  } = req.body;
    // console.log(req.body);

    // let student = await Student.findOne({ email });
    // if (student) {
    //   return res.status(400).json({ msg: 'Student already exists' });
    // }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Here is the title of the video: ${title}. Here is the description of the video: ${description}. Give me top 5 skills related to the video in 5 words`;

        const result = await model.generateContent(prompt);
        const regex = /\*\*(.*?)\*\*/; 
        // const match = result.response.text().match(regex);
        // console.log(result.response.text().split(','));

    const course = new Course({
      title,
      description,
      skills: result.response.text().split(','),
      courseLink: link,
    });
    await course.save();
    // console.log(course);

    res.status(201).json({ msg: "Course Uploaded successfully!" });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.completeCourse = async (req, res) => {
    try {
      const { _id  } = req.body;
      // console.log(req.body);
      let token = req.body.token ;
  
      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        // console.log(decodedToken);
        if (err) {
          console.log(err);
          return res.status(401).json({ message: "Not authorized" })
        } else {  
          req.id = decodedToken.id;
        }
      })
    const student = await Student.findById(req.id);
    const course = await Course.findById(_id);
    // console.log(student);
    // console.log(course);
    if(!student.enrolledCourses.includes(course._id)){
        student.enrolledCourses.push(course._id);
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
    const { UDUMY_CLIENT_ID, UDUMY_CLIENT_SECRET } = process.env;

    if (!UDUMY_CLIENT_ID || !UDUMY_CLIENT_SECRET) {
      console.error('Udemy API credentials are missing.');
      return res.status(500).json({ msg: 'Server error: Missing API credentials.' });
    }

    const credentials = Buffer.from(`${UDUMY_CLIENT_ID}:${UDUMY_CLIENT_SECRET}`).toString('base64');

    const response = await axios.get('https://www.udemy.com/api-2.0/courses/', {
      params: {
        search: 'React, Node.js, Javascript',
        page: 1,
        page_size: 50
      },
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
      }
    });

    const formattedCourses = response.data.results.map(course => ({
      title: course.title,
      id: course.id,
      description: course.headline,
      courseLink: `https://www.udemy.com${course.url}`,
      skills: course.visible_instructors[0]?.job_title?.split(',') || [],
      uploadedDate: new Date(),
      price: course.price,
      instructor: course.visible_instructors[0]?.display_name || 'Unknown',
      image: course.image_240x135,
      language: course.locale?.english_title || 'Unknown'
    }));

    console.log("Fetched Courses:", formattedCourses);
    res.json(formattedCourses);
  } catch (err) {
    console.error('Error fetching courses:', err.response ? err.response.data : err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.findSkillfromIssue = async(req, res) => {
    try {
        const {issue} = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Give me 5 top skills in 5 words for the issue: ${issue}`;

        const result = await model.generateContent(prompt);
        // console.log(result.response.text());
        const regex = /\*\*(.*?)\*\*/; 
        const match = result.response.text().match(regex);
        // console.log(match[1].split(','));
    
        res.status(200).json({ data: match[1].split(',') });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
}

