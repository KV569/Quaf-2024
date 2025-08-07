const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Please add an excerpt'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorImage: {
    type: String,
    default: 'default.jpg'
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Updates', 'Arabic', 'English', 'Urdu', 'Malayalam', 'Hindi']
  },
  readTime: {
    type: String,
    required: [true, 'Please add read time']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create article slug from the title
articleSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

module.exports = mongoose.model('Article', articleSchema);