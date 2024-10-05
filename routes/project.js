const express = require('express');
const router = express.Router();
const {addProject, getProjects, getAllOpenProjects, applyProject, getAppliedProjecs,getProjectById, selectStudentsforProject} = require('../controllers/project');

router.post('/addProject', addProject);
router.post('/getProjects', getProjects);
router.post('/getProjectById', getProjectById);
router.get('/getAllOpenProjects', getAllOpenProjects);
router.post('/applyProject', applyProject);
router.post('/getAppliedProjecs', getAppliedProjecs);
router.post('/selectStudentsforProject', selectStudentsforProject);

module.exports = router;
