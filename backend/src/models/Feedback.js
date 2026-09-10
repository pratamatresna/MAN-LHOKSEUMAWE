const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  createdAt: String, read: { type: Boolean, default: false }
});
module.exports = mongoose.model('Feedback', schema);