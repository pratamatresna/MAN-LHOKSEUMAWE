const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: String, slug: String, content: String,
  category: String, date: String, imageUrl: String,
  author: String, views: { type: Number, default: 0 }
});
module.exports = mongoose.model('News', schema);