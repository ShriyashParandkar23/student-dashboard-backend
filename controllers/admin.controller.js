// controllers/adminController.js
const Admin = require('../models/admin.model');

// Admin SignUp (Register a new admin)
const signup = async (req, res) => {
  const { name, password, user_id } = req.body;

  if (!name || !password || !user_id) {
    return res.status(400).json({ message: 'Please provide name, password, and user_id' });
  }

  try {
    // Check if the user already exists
    const existingAdmin = await Admin.findOne({ user_id });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this user_id already exists' });
    }

    // Create a new admin (no password hashing)
    const newAdmin = new Admin({
      name,
      password, // Store password in plain text
      user_id,
    });

    // Save the admin
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Admin SignIn (Login to an admin account)
const signin = async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ message: 'Please provide user_id and password' });
  }

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ user_id });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the password matches (without hashing)
    if (admin.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // If successful, just send a success message
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = { signup, signin,getAllAdmins };
