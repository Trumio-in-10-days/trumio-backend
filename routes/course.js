const express = require('express');
const router = express.Router();
const {uploadCourse, getAllCourses, completeCourse, findSkillfromIssue} = require('../controllers/course');

router.post('/upload', uploadCourse);
router.post('/completeCourse', completeCourse);
router.post('/findSkillfromIssue', findSkillfromIssue);
router.get('/getAllCourses', getAllCourses);

module.exports = router;
