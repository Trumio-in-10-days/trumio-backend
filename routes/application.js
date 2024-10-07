const express = require('express');
const router = express.Router();

// Import the functions
const { addApplication, getApplication } = require('../controllers/applicaton');

// Define the POST route for adding an application
router.post('/applications', addApplication);
 
// Define the Post route for fetching an application by ID
router.post('/getapplication', getApplication);
 
module.exports = router;
