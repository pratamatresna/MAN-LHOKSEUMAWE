const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: String, category: String, format: String, size: String,
  url: String, downloadsCount: { type: Number, default: 0 }
});
module.exports = mongoose.model('Download', schema);