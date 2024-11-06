const mongoose = require('mongoose');

// Updated comment schema to reference only userId
const commentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Blog schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        username: { type: String, required: false },
        email: { type: String, required: false }
    },
    comments: [commentSchema],  // An array of comments, each referencing a user by userId
    creationDate: { type: Date, default: Date.now }  // Explicit creation date
}, {});

module.exports = mongoose.model('Blog', blogSchema);
