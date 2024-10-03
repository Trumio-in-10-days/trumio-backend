const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Admin = require('../models/admin');

const JWT_SECRET = 'yourSecretKey';

exports.studentSignUp = async (req, res) => {
  try {
    const { name, email, password, alumni } = req.body;
    // console.log(req.body);

    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ msg: 'Student already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    student = new Student({
      name,
      email,
      password: hashedPassword,
      isAlumni: alumni
    });
    await student.save();

    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Student Sign In
exports.studentSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin Sign Up
exports.adminSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin Sign In
exports.adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
