const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: String, type: String, url: String, category: String, date: String
});
module.exports = mongoose.model('Gallery', schema);