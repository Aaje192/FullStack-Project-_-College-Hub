const User = require('../models/UserModel.cjs');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  try {
    const {
      userType, id, username, password, email, department,
      year, branch, course, mobile
    } = req.body;

    if (!userType || !id || !username || !password || !email || !department || !mobile) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    if (userType === 'student' && (!year || !branch || !course)) {
      return res.status(400).json({ message: 'Missing student fields.' });
    }

    const exists = await User.findOne({ $or: [{ id }, { username }, { email }] });
    if (exists) return res.status(409).json({ message: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userType, id, username,
      password: hashedPassword,
      email, department, year, branch, course, mobile
    });
    await user.save();

    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required.' });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials.' });

    res.json({
      message: 'Login successful.',
      userType: user.userType,
      username: user.username,
      id: user.id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};