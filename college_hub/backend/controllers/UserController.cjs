const User = require('../models/UserModel.cjs');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/emailService.cjs');
const crypto = require('crypto');

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
    console.log('Login attempt for username:', username);
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password required.' });
    }

    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('No user found with username:', username);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('Login successful for user:', username);
    res.json({
      message: 'Login successful.',
      userType: user.userType,
      username: user.username,
      id: user.id
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params; // id can be studentid or staffid
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // You can select only the fields you want to send
    res.json({
      name: user.username,
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      year: user.year,
      department: user.department,
      branch: user.branch,
      course: user.course,
      userType: user.userType
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate password reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Save token to user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email with frontend URL
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      'Password Reset Request',
      `You have requested to reset your password.\n\n` +
      `Please click on the following link to reset your password:\n\n` +
      `${resetLink}\n\n` +
      `This link will expire in 1 hour.\n\n` +
      `If you did not request this, please ignore this email.`
    );

    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Error sending reset email.' });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log('Received reset request with token:', token);
    
    if (!token || !newPassword) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    console.log('Found user:', user ? user.email : 'No user found');

    if (!user) {
      console.log('Invalid or expired token');
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Password hashed successfully');

    // Update user document
    const updateResult = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: 1, resetTokenExpiry: 1 }
      },
      { new: true } // Return the updated document
    );

    console.log('Update result:', updateResult);

    if (!updateResult) {
      console.log('Failed to update password');
      return res.status(500).json({ message: 'Failed to update password.' });
    }

    // Verify the update
    const verifyUser = await User.findById(user._id);
    console.log('Verification - Password updated:', verifyUser.password === hashedPassword);
    console.log('Verification - Reset token cleared:', !verifyUser.resetToken);
    console.log('Verification - Reset token expiry cleared:', !verifyUser.resetTokenExpiry);

    // Send confirmation email
    try {
      await sendEmail(
        user.email,
        'Password Reset Successful',
        'Your password has been successfully reset.\n\n' +
        'If you did not make this change, please contact support immediately.'
      );
      console.log('Confirmation email sent');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with the password reset even if email fails
    }

    console.log('Password reset successful for user:', user.email);
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Error resetting password.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find user by their ID
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'username',
      'email',
      'mobile',
      'department',
      'year',
      'branch',
      'course'
    ];

    // Filter out any fields that aren't in allowedUpdates
    const filteredData = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { id },
      filteredData,
      { new: true }
    );

    // Return updated profile data
    res.json({
      name: updatedUser.username,
      id: updatedUser.id,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      year: updatedUser.year,
      department: updatedUser.department,
      branch: updatedUser.branch,
      course: updatedUser.course,
      userType: updatedUser.userType
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};