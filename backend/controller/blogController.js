const Blog = require('../model/blogSchema');
const User = require('../model/userSchema');


// Create a new blog
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const imagePaths = req.files ? req.files.map(file => file.path) : [];

  try {
    const blog = new Blog({
      title,
      content,
      author: req.user.id,
      images: imagePaths,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'userName')  // Populate the author field with userName
      .sort({ createdAt: -1 });  // Sort blogs by creation date, newest first

    res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get my blogs (blogs by the authenticated user)
exports.getMyBlogs = async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ author: id })  // Filter blogs by the user's ID
      .populate('author', 'userName')  // Populate the author field with userName
      .sort({ createdAt: -1 });  // Sort blogs by creation date, newest first
    
    res.status(200).json({ message: 'My blogs retrieved successfully', blogs });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Edit an existing blog (only by the author )
exports.editBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const imagePaths = req.files ? req.files.map(file => file.path) : [];

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id ) {
      return res.status(403).json({ message: 'You are not authorized to edit this blog' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.images = [...blog.images, ...imagePaths]; // Add new images

    await blog.save();
    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a blog (only by the author)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
 
    if (blog.author.toString() !== req.user.id ) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;  // Get the blog ID from the URL parameters


  try {
   
    const blog = await Blog.findById(id).populate('author', 'userName');

 
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog retrieved successfully', blog });
  } catch (err) {
   
    res.status(400).json({ message: err.message });
  }
};





// Like or Unlike a blog
exports.toggleLike = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user.id;

    // If the user has already liked the blog, remove the like (unlike)
    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(like => like.toString() !== userId.toString());
      await blog.save();
      return res.status(200).json({ message: 'Blog unliked successfully' });
    } else {
      // If the user has not liked the blog, add the like
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: 'Blog liked successfully' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
