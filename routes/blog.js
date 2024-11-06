// routes/blog.js
const express = require('express');
const blogController = require('../controllers/blog'); 
const { verify, verifyAdmin } = require('../auth');
const router = express.Router();

router.post("/addBlog", verify, blogController.addBlog); 
router.get("/getAllBlogs", verify, blogController.getAllBlogs);
router.get("/getBlog/:id", verify, blogController.getBlogById); 
router.get("/getComments/:id", verify, blogController.getBlogComments); 
router.patch("/updateBlog/:id", verify, blogController.updateBlog);
router.delete("/deleteBlog/:id", verify, verifyAdmin, blogController.deleteBlog); 
router.post("/addComment/:id", verify, blogController.addBlogComment); 
router.delete("/removeComment/:id/:commentId", verify, verifyAdmin, blogController.removeBlogComment); 

module.exports = router;
