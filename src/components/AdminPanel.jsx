import { useEffect, useMemo, useState } from 'react';
import { adminCreateBlog, getStoredApiKey, setStoredApiKey } from '../services/admin';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  // Blog form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    const key = getStoredApiKey();
    if (key) setApiKey(key);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Get credentials from environment variables
    const validUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password';
    
    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setUsername('');
    setPassword('');
  };

  const canSubmitBlog = useMemo(() => title && category && content, [title, category, content]);

  const handleSaveKey = () => {
    setStoredApiKey(apiKey.trim());
    setStatus('API key saved');
    setTimeout(() => setStatus(''), 1500);
  };

  const submitBlog = async (e) => {
    e.preventDefault();
    try {
      setStatus('Creating blog...');
      const tagsArray = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : null;
      await adminCreateBlog({ title, content, category, tags: tagsArray });
      setStatus('Blog created');
      setTitle(''); setCategory('general'); setTags(''); setContent('');
    } catch (err) {
      setStatus(`Error: ${err.message || 'Failed'}`);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="post" style={{ maxWidth: '480px', margin: '4rem auto', padding: '2rem' }}>
          <h2 className="post-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>
          <form onSubmit={handleLogin} className="add-content-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                className="form-input" 
                type="text"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                className="form-input" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}
            <div className="form-actions">
              <button className="form-button form-button-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 'var(--space-lg)', 
        marginBottom: 'var(--space-xl)',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <h2 className="post-title" style={{ margin: 0, flex: '1 1 auto' }}>Admin Panel</h2>
        <button 
          className="form-button" 
          onClick={handleLogout}
          style={{ 
            padding: '0.5rem 1.25rem',
            fontSize: '0.9rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            flex: '0 0 auto',
            whiteSpace: 'nowrap'
          }}
        >
          Logout
        </button>
      </div>

      <section className="post">
        <h3 className="twitter-sidebar-title">Create Blog</h3>
        <form onSubmit={submitBlog} className="add-content-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <div style={{ 
              border: '1px solid var(--color-border)', 
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your blog content here..."
                style={{ 
                  minHeight: '400px',
                  backgroundColor: 'var(--color-background)'
                }}
              />
            </div>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--color-text-light)', 
              marginTop: '0.5rem' 
            }}>
              Supports rich formatting, images, videos, code blocks, and more
            </p>
          </div>
          <div className="form-actions">
            <button className="form-button form-button-primary" type="submit" disabled={!canSubmitBlog}>Create Blog</button>
            {status && <span style={{ color: 'var(--color-text-light)', marginLeft: '1rem' }}>{status}</span>}
          </div>
        </form>
      </section>
    </div>
  );
}








