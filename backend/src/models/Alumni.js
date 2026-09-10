const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String, nisn: String, graduationYear: String,
  status: String, gender: String
});
module.exports = mongoose.model('Alumni', schema);