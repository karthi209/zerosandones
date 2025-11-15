import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchBlogs, fetchCategories, fetchBlogArchives } from '../services/api';
import './BlogsPage.css';

export default function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [archives, setArchives] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');

  // Ancient symbols - same as home page
  const symbols = [
    '◉', '◈', '⬢', '◐', '◑', '◓', '⊙', '⊚', '⊛', '☥', '⚶', '⚸',
    '◆', '◇', '●', '○', '■', '□', '▲', '△', '⬟', '⬠', '⬡', '◬', '⊗'
  ];

  // Fetch all necessary data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [blogsData, categoriesData, archivesData] = await Promise.all([
          fetchBlogs(),
          fetchCategories(),
          fetchBlogArchives()
        ]);
        setBlogs(blogsData);
        setCategories(categoriesData);
        setArchives(archivesData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      }
    };
    loadData();
  }, []);

  // Apply filters and sorting
  const handleFilter = async () => {
    try {
      const filters = {
        category: selectedCategory,
        sortBy: 'date',
        order: sortOrder
      };
      if (selectedDate) {
        const [year, month] = selectedDate.split('-');
        filters.startDate = new Date(year, month - 1, 1);
        filters.endDate = new Date(year, month, 0);
      }
      const filteredBlogs = await fetchBlogs(filters);
      setBlogs(filteredBlogs);
    } catch (error) {
      console.error('Error filtering blogs:', error);
    }
  };

  // Handle tab change
  const handleCategoryChange = (category) => {
    setActiveTab(category);
    setSelectedCategory(category === 'all' ? '' : category);
    if (category === 'all') {
      setSearchParams({ tab: 'all' });
    } else {
      setSearchParams({ tab: category, category: category });
    }
  };

  // Re-fetch when category or sort changes
  useEffect(() => {
    handleFilter();
  }, [selectedCategory, sortOrder, selectedDate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter blogs based on active tab
  const filteredBlogs = activeTab === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeTab);

  return (
    <div className="blogs-container">
      <aside className="blog-sidebar">
        {/* Categories */}
        <div className="blog-categories">
          <h3><span className="section-symbol-small">◈</span> Categories</h3>
          <select 
            value={activeTab} 
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Archives */}
        <div className="blog-archives">
          <h3><span className="section-symbol-small">⬢</span> Archives</h3>
          <select 
            value={selectedDate} 
            onChange={(e) => {
              setSelectedDate(e.target.value);
              handleFilter();
            }}
          >
            <option value="">All Time</option>
            {archives.map(archive => (
              <option 
                key={`${archive._id.year}-${archive._id.month}`}
                value={`${archive._id.year}-${archive._id.month}`}
              >
                {monthNames[archive._id.month - 1]} {archive._id.year} ({archive.count})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="blog-sort">
          <h3><span className="section-symbol-small">⊙</span> Sort By</h3>
          <select 
            value={sortOrder} 
            onChange={(e) => {
              setSortOrder(e.target.value);
              handleFilter();
            }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </aside>

      <main className="blog-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 className="blog-title" style={{ marginBottom: 0 }}>
            <span className="section-symbol">◉</span> Blogs
          </h2>
        </div>
        {filteredBlogs.length === 0 ? (
          <div className="post">
            <p className="post-content">No posts yet. Create your first thought!</p>
          </div>
        ) : (
          filteredBlogs.map((blog, index) => {
            // Deterministic symbol based on blog ID
            const symbolIndex = blog._id ? String(blog._id).charCodeAt(0) % symbols.length : index % symbols.length;
            const blogSymbol = symbols[symbolIndex];
            
            return (
              <article key={blog._id} className="blog-post">
                <h3 className="post-title">
                  <span style={{ opacity: 0.7, marginRight: '0.5rem' }}>{blogSymbol}</span>
                  <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                </h3>
                <div className="post-metadata">
                  <span className="post-date">
                    {new Date(blog.date).toLocaleDateString()}
                  </span>
                  {blog.category && (
                    <span className="post-category">{blog.category}</span>
                  )}
                </div>
                <div className="post-preview">
                  {String(blog.content || '').replace(/<[^>]*>/g, '').substring(0, 200)}...
                </div>
                <Link to={`/blogs/${blog._id}`} className="read-more">
                  Read More →
                </Link>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
