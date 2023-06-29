const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { validatePost } = require('../utils/postvalidaor');

// Create a new post
router.post('/posts', authenticate, async (req, res) => {
  try {
    const { name, description, postImageURL, location } = req.body;

    // Validate the post data
    const errors = validatePost(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Create a new post
    const post = new Post({
      name,
      description,
      postImageURL,
      location,
    });

    // Save the post to the database
    await post.save();

    res.status(201).json({
      status: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while creating the post',
    });
  }
});

// Get all posts
router.get('/posts', authenticate, async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find();

    res.json({
      status: true,
      message: 'Successfully retrieved posts',
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving posts',
    });
  }
});
// Get a single post by ID
router.get('/posts/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate('comments', 'description');

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    res.json({
      status: true,
      message: 'Successfully retrieved the post',
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving the post',
    });
  }
});

// Update a post by ID
router.put('/posts/:id', authenticate, async (req, res) => {
  try {
    const postId = req.params.id;
    const { name, description, postImageURL, location } = req.body;

    // Find the post by ID and update its fields
    const post = await Post.findByIdAndUpdate(
      postId,
      { name, description, postImageURL, location },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    res.json({
      status: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while updating the post',
    });
  }
});

// Delete a post by ID
router.delete('/posts/:id', authenticate, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID and remove it
    const post = await Post.findByIdAndRemove(postId);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    res.json({
      status: true,
      message: 'Post deleted successfully',
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while deleting the post',
    });
  }
});

// Create a new comment
router.post('/comments/:id', authenticate, async (req, res) => {
  const {id} = req.params;
  const {description} = req.body;
  try {
   

    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    // Create a new comment
    const newComment = new Comment({
      postId: post._id,
      description,
    });

    // Save the comment to the database
    await newComment.save();

    // Add the comment to the post's comments array
    post.comments = post.comments || [];
    post.comments.push(newComment);
   
    await post.save();

    res.status(201).json({
      status: true,
      message: 'Comment created successfully',
      newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while creating the comment',
    });
  }
});

// Get comments for a post
router.get('/posts/:id/comments', authenticate, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID and populate the comments
    const post = await Post.findById(postId).populate('comments');

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    res.json({
      status: true,
      message: 'Successfully retrieved comments',
      comments: post.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving comments',
    });
  }
});

module.exports = router;
