const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SecuritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_no: { type: String, required: true },
  employee_code: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  password: { type: String, required: true },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  is_active: { type: Boolean, default: true },
  deleted_status: { type: Boolean, default: false },
});



SecuritySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Security', SecuritySchema);
