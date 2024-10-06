const express = require('express');
const router = express.Router();
const { getAllStudents, findProjectPair, PairforProject, getStudent, updateSkill, changeAlumni, getStudentById} = require('../controllers/student');

router.get('/getAllStudents', getAllStudents);
router.post('/findProjectPair', findProjectPair);
router.post('/PairforProject', PairforProject);
router.post('/getStudent', getStudent);
router.post('/getStudentById', getStudentById);
router.post('/updateSkill', updateSkill);changeAlumni
router.post('/changeAlumni', changeAlumni);

module.exports = router;
