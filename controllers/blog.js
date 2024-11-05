// controllers/blog.js
const Blog = require('../models/Blog');
const bcrypt = require('bcryptjs');
const auth = require('../auth');

module.exports.addBlog = async (req, res) => {
    try {
        const newBlog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.user.id, // Ensure the author is the logged-in user
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: "Error adding blog", error });
    }
};

module.exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find(); 
        res.status(200).json({ blogs });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving blogs", error });
    }
};

module.exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('comments.userId', 'username'); // Populate with username
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        
        res.status(200).json(blog); 
    } catch (error) {
        res.status(500).json({ message: "Error retrieving blog", error });
    }
};

module.exports.updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
        
        res.status(200).json(updatedBlog); 
    } catch (error) {
        res.status(400).json({ message: "Error updating blog", error });
    }
};

module.exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    }
};

module.exports.addBlogComment = async (req, res) => {
    try {
        if (!req.body.comment) {
            return res.status(400).json({ message: "Comment is required" });
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Push the comment into the blog post's comments array
        blog.comments.push({ userId: req.user.id, comment: req.body.comment });
        await blog.save();

        res.status(200).json({ message: "Comment added successfully", blog });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

module.exports.getBlogComments = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('comments.userId', 'username');
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Extract comments with username
        const comments = blog.comments.map(comment => ({
            userId: comment.userId._id,
            username: comment.userId.username,
            comment: comment.comment,
            _id: comment._id
        }));

        res.status(200).json(comments); 
    } catch (error) {
        res.status(500).json({ message: "Error retrieving comments", error: error.message });
    }
};

module.exports.removeBlogComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Find the comment by ID and remove it
        const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Optional: Check if the user trying to delete the comment is the one who made it
        if (blog.comments[commentIndex].userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        // Remove the comment from the blog's comments array
        blog.comments.splice(commentIndex, 1);
        await blog.save();

        res.status(200).json({ message: "Comment removed successfully", blog });
    } catch (error) {
        res.status(500).json({ message: "Error removing comment", error: error.message });
    }
};
