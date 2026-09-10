const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: String, date: String, time: String, location: String, description: String
});
module.exports = mongoose.model('Agenda', schema);