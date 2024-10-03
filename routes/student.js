const express = require('express');
const router = express.Router();
const { getAllStudents, findProjectPair, PairforProject, getStudent, updateSkill} = require('../controllers/student');

router.get('/getAllStudents', getAllStudents);
router.post('/findProjectPair', findProjectPair);
router.post('/PairforProject', PairforProject);
router.post('/getStudent', getStudent);
router.post('/updateSkill', updateSkill);

module.exports = router;
