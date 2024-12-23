const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [String],  // Array to hold image paths
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;