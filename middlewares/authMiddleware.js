const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Security = require('../models/Security');

const protect = async (req, res, next) => {
  let token;
  console.log("Verification Started")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
    
      console.log(req.headers.authorization)
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, "logixspace");
      req.user = await Admin.findById(decoded.id) || await Security.findById(decoded.id);
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
