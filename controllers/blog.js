const Blog = require('../models/Blog');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');

// Add a new blog post
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

// Get all blogs with author populated
module.exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username'); // Populate the author's username
        res.status(200).json({ blogs });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving blogs", error });
    }
};

// Get a blog by ID with populated author and comments (with user details)
module.exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username') // Populate the author's username
            .populate('comments.userId', 'username'); // Populate the username for each comment

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving blog", error });
    }
};

// Update a blog post
module.exports.updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: "Error updating blog", error });
    }
};

// Delete a blog post
module.exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    }
};

// Add a comment to a blog
// In blogController.js
exports.addBlogComment = async (req, res) => {
    const blogId = req.params.id;
    const { comment } = req.body;

    try {
        // Assuming you are using a Blog model for this operation
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Add the comment to the blog
        blog.comments.push({
            userId: req.user.id,
            comment: comment,
            createdAt: new Date()
        });

        await blog.save();

        res.json({
            message: "Comment added successfully.",
            post: blog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Get all comments of a blog
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

// Remove a comment from a blog
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
