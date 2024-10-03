const express = require('express');
const router = express.Router();
const {studentSignIn, studentSignUp, adminSignIn, adminSignUp} = require('../controllers/auth');

router.post('/student/signup', studentSignUp);
router.post('/student/signin', studentSignIn);
router.post('/admin/signup', adminSignUp);
router.post('/admin/signin', adminSignIn);

module.exports = router;
