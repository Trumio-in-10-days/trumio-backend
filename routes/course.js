const express = require('express');
const router = express.Router();
const {uploadCourse, getAllCourses, completeCourse} = require('../controllers/course');

router.post('/upload', uploadCourse);
router.post('/completeCourse', completeCourse);
router.get('/getAllCourses', getAllCourses);

module.exports = router;
