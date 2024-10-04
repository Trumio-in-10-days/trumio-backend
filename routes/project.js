const express = require('express');
const router = express.Router();
const {addProject, getProjects, getAllOpenProjects} = require('../controllers/project');

router.post('/addProject', addProject);
router.post('/getProjects', getProjects);
router.get('/getAllOpenProjects', getAllOpenProjects);

module.exports = router;
