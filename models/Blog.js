// models/Blog.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true }, // Add username to the comment schema
    email: { type: String, required: true },    // Add email to the comment schema
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        username: { type: String, required: true },
        email: { type: String, required: true }
    },
    comments: [commentSchema],
    creationDate: { type: Date, default: Date.now },  // explicit creation date
}, {});

module.exports = mongoose.model('Blog', blogSchema);
