const mongoose = require('mongoose');

const DailyLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  securityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Security', required: true },
  visitorName: { type: String, required: true },
  purpose: { type: String, required: true },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date }
});

module.exports = mongoose.model('DailyLog', DailyLogSchema);
