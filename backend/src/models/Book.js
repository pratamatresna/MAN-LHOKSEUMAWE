const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: String, author: String, category: String, isbn: String,
  available: Boolean, coverUrl: String
});
module.exports = mongoose.model('Book', schema);