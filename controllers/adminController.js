const Admin = require('../models/Admin');
const Security = require('../models/Security');
const DailyLog = require('../models/DailyLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


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
      const { name, email, phone_no, employee_code, address, date_of_birth, password, created_by, updated_by } = req.body;

      // Validate if required fields are present
      if (!name || !email || !phone_no || !employee_code || !address || !date_of_birth || !password || !created_by || !updated_by) {
          return res.status(400).json({ error: "All fields are required." });
      }

      // Ensure `created_by` and `updated_by` are valid ObjectIds
      if (!mongoose.Types.ObjectId.isValid(created_by) || !mongoose.Types.ObjectId.isValid(updated_by)) {
          return res.status(400).json({ error: "Invalid admin ID format." });
      }

      // Check if email or employee_code already exists
      const existingSecurity = await Security.findOne({ 
        $or: [{ email: { $exists: true, $eq: email } }, { employee_code: { $exists: true, $eq: employee_code } }]
    });
    

      console.log("Existing...")
      console.log(existingSecurity)

      console.log("Received Data:", req.body);
console.log("Checking for existing security with Email:", email, "and Employee Code:", employee_code);
console.log("Existing Security Found:", existingSecurity);


      if (existingSecurity!=null) {
          return res.status(409).json({ error: "Email or Employee Code already exists." });
      }

      // Create new Security guard
      const newSecurity = new Security({
          name,
          email,
          phone_no,
          employee_code,
          address,
          date_of_birth,
          password,
          created_by,
          updated_by
      });

     // console.log(newSecurity)

      await newSecurity.save();
      res.status(201).json({ message: 'Security guard added successfully', security: newSecurity });

  } catch (error) {
      if (error.code === 11000) {
          return res.status(409).json({ error: "Duplicate entry detected. Email or Employee Code already exists." });
      }
      console.error('Error adding security guard:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
