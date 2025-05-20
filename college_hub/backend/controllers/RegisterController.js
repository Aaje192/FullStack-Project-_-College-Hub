const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

exports.registerStudent = async (req, res) => {
  try {
    const { username, studentId, email, dob, year, semester, department, password, confirmPassword } = req.body;

    // Basic validation
    if (!username || !studentId || !email || !dob || !year || !semester || !department || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check for existing student
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email or Student ID already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = new Student({
      username,
      studentId,
      email,
      dob,
      year,
      semester,
      department,
      password: hashedPassword,
    });

    await student.save();
    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};