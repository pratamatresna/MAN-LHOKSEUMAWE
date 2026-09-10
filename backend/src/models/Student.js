const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String, nisn: String, nism: String, class: String,
  gender: String, phone: String, graduationStatus: String, raporScore: Number
});
module.exports = mongoose.model('Student', schema);