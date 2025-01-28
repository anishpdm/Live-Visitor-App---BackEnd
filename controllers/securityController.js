const Security = require('../models/Security');
const DailyLog = require('../models/DailyLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginSecurity = async (req, res) => {
  const { username, password } = req.body;
  const security = await Security.findOne({ username });
  if (security && (await bcrypt.compare(password, security.password))) {
    const token = jwt.sign({ id: security._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const addLog = async (req, res) => {
  const { visitorName, purpose, entryTime, exitTime } = req.body;
  try {
    const newLog = new DailyLog({ securityId: req.user.id, visitorName, purpose, entryTime, exitTime });
    await newLog.save();
    res.status(201).json({ message: 'Log added' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const viewLogs = async (req, res) => {
  const logs = await DailyLog.find({ securityId: req.user.id });
  res.json(logs);
};

const editLog = async (req, res) => {
  try {
    const updatedLog = await DailyLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { loginSecurity, addLog, viewLogs, editLog };
