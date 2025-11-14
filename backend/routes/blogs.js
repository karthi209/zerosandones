import { Router } from 'express';
import { Blog } from '../models/Blog.js';

const router = Router();

// Get all blogs with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, sortBy, order } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;
    
    const blogs = await Blog.findAll(filters);
    
    // Apply date filters if needed (could be moved to model)
    let filteredBlogs = blogs;
    if (startDate) {
      filteredBlogs = filteredBlogs.filter(blog => new Date(blog.date) >= new Date(startDate));
    }
    if (endDate) {
      filteredBlogs = filteredBlogs.filter(blog => new Date(blog.date) <= new Date(endDate));
    }
    
    // Map id to _id for frontend compatibility
    const result = filteredBlogs.map(row => ({ ...row, _id: row.id }));
    res.json(result);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.getCategories();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get blogs by category
router.get('/category/:category', async (req, res) => {
  try {
    const blogs = await Blog.findAll({ category: req.params.category, sortBy: 'date', order: 'DESC' });
    const result = blogs.map(row => ({ ...row, _id: row.id }));
    res.json(result);
  } catch (err) {
    console.error('Error fetching blogs by category:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get blog archives (grouped by month and year)
router.get('/archives', async (req, res) => {
  try {
    const archives = await Blog.getArchives();
    
    const result = archives.map(row => ({
      _id: {
        year: parseInt(row.year),
        month: parseInt(row.month)
      },
      count: parseInt(row.count)
    }));
    
    res.json(result);
  } catch (err) {
    console.error('Error fetching archives:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add new blog
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ 
        message: 'Title, content, and category are required' 
      });
    }

    // Convert tags array to PostgreSQL array format
    const tagsArray = tags && Array.isArray(tags) ? tags : 
                     tags && typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(t => t) :
                     null;

    const blog = await Blog.create({ title, content, category, tags: tagsArray });
    res.status(201).json({ ...blog, _id: blog.id });
  } catch (err) {
    console.error('Error saving blog:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ ...blog, _id: blog.id });
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, category, tags } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.update(id, { title, content, category, tags: tags || null });

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ ...blog, _id: blog.id });
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    const blog = await Blog.delete(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully', blog });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
