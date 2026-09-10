const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  operatorName: String, operatorRole: String, action: String,
  timestamp: String, details: String
});
module.exports = mongoose.model('ActivityLog', schema);