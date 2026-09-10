const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String, nip: String, role: String,
  subject: String, imageUrl: String, gender: String, status: String
});
module.exports = mongoose.model('Teacher', schema);