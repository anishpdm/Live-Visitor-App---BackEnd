const Admin = require('../models/Admin');
const Security = require('../models/Security');
const DailyLog = require('../models/DailyLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


async function loginAdmin(req, res) {
  const { username, password } = req.body;

  try {
      // Find the admin by username
      const admin = await Admin.findOne({ username });

      if (!admin) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare passwords
      console.log(password)
      console.log(admin.password)
      const isPasswordValid = await bcrypt.compare(password, admin.password);

       const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)
      console.log(isPasswordValid)

      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials Password' });
      }

      // Generate a token (if applicable)
      const token = jwt.sign({ id: admin._id }, "logixspace", { expiresIn: '12h' });

      return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}


// Add Security Guard API
const addSecurity = async (req, res) => {
  try {
    const {
      name,
      email,
      phone_no,
      employee_code,
      address,
      date_of_birth,
      password,
      created_by,
    } = req.body;

    // Check if required fields are provided
    if (!name || !email || !phone_no || !employee_code || !address || !date_of_birth || !password || !created_by) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if security guard with the same email or employee_code already exists
    const existingSecurity = await Security.findOne({
      $or: [{ email }, { employee_code }],
    });

    if (existingSecurity) {
      return res.status(409).json({ message: 'Email or Employee Code already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Security Guard record
    const newSecurityGuard = new Security({
      name,
      email,
      phone_no,
      employee_code,
      address,
      date_of_birth,
      password: hashedPassword,
      created_by,
      updated_by: created_by,
    });

    // Save the record
    const savedSecurity = await newSecurityGuard.save();

    res.status(201).json({
      message: 'Security guard added successfully.',
      data: savedSecurity,
    });
  } catch (error) {
    console.error('Error adding security guard:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const viewAllSecurity = async (req, res) => {
  const securityGuards = await Security.find();
  res.json(securityGuards);
};

const removeSecurity = async (req, res) => {
  try {
    await Security.findByIdAndDelete(req.params.id);
    res.json({ message: 'Security guard removed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const viewLogs = async (req, res) => {
  const logs = await DailyLog.find().populate('securityId', 'username');
  res.json(logs);
};


// Search Security
const searchSecurityByName = async (req, res) => {
  try {
    const { name } = req.body; // Get the name from request body

    if (!name) {
      return res.status(400).json({ message: 'Name field is required.' });
    }

    // Perform a case-insensitive search using a regex pattern
    const securityGuards = await Security.find({
      name: { $regex: name, $options: 'i' }
    });

    if (securityGuards.length === 0) {
      return res.status(404).json({ message: 'No security guards found.' });
    }

    res.status(200).json(securityGuards);
  } catch (error) {
    console.error('Error searching security guards:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { loginAdmin, addSecurity, viewAllSecurity, removeSecurity, viewLogs,searchSecurityByName };
