import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BlogsPage from './BlogsPage';
import WhoamiPage from './WhoamiPage';
import LibraryPage from './LibraryPage';
import MusicLibrary from './MusicLibrary';
import PlaylistPage from './PlaylistPage';
import GamesLibrary from './GamesLibrary';
import ScreenLibrary from './ScreenLibrary';
import ReadsLibrary from './ReadsLibrary';
import FieldnotesPage from './FieldnotesPage';
import LabPage from './LabPage';
import BlogPost from './BlogPost';
import LogDetail from './LogDetail';
import AdminPanel from './AdminPanel';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import Disclaimer from '../pages/Disclaimer';
import { fetchBlogs, fetchLogs } from '../services/api';
import '../styles/classic2000s.css';

export default function Home({ themeToggleButton }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState('home');
  const [activeLogTab, setActiveLogTab] = useState('games');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [libraryDropdownOpen, setLibraryDropdownOpen] = useState(false);
  const [libraryDropdownMobileOpen, setLibraryDropdownMobileOpen] = useState(false);
  const [entries, setEntries] = useState({
    blogs: [],
    music: [],
    games: [],
    movies: [],
    series: [],
    books: []
  });
  
  // Check if we're on a blog post page
  const isBlogPostPage = location.pathname.startsWith('/blog/') || location.pathname.startsWith('/blogs/');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isPlaylistPage = location.pathname.match(/^\/library\/music\/\d+$/);
  const isLogDetailPage = !isPlaylistPage && location.pathname.startsWith('/library/') && location.pathname.split('/').length > 3;
  const isLegalPage = location.pathname === '/terms' || location.pathname === '/privacy' || location.pathname === '/disclaimer';
  
  // Update active page based on URL - default to home
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (isBlogPostPage || isLogDetailPage || isPlaylistPage) {
      return; // Don't change active page for blog posts, log details, or playlist pages
    }
    if (isAdminPage) {
      return; // Keep navigation untouched on admin
    }
    if (isLegalPage) {
      return; // Don't redirect legal pages
    }
    
    if (location.pathname === '/' || location.pathname === '') {
      setActivePage('home');
    } else if (location.pathname === '/blogs' || location.pathname.startsWith('/blogs')) {
      setActivePage('blogs');
    } 
    else if (location.pathname === '/library' || location.pathname.startsWith('/library')) {
      setActivePage('library');
    } else if (location.pathname === '/projects' || location.pathname.startsWith('/projects')) {
      setActivePage('projects');
    } else if (location.pathname === '/whoami' || location.pathname.startsWith('/whoami')) {
      setActivePage('whoami');
    } else if (!location.pathname.startsWith('/blog/') && !location.pathname.startsWith('/blogs/')) {
      // Default to home if path doesn't match (except blog posts)
      setActivePage('home');
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, isBlogPostPage, isLogDetailPage, isPlaylistPage, isAdminPage, isLegalPage, navigate]);

  const renderLibraryPage = () => {
    const path = location.pathname;
    // Check for individual playlist page
    const playlistMatch = path.match(/^\/library\/music\/(\d+)$/);
    if (playlistMatch) {
      const playlistId = playlistMatch[1];
      return <PlaylistPage id={playlistId} />;
    }
    if (path.includes('/library/music')) return <MusicLibrary />;
    if (path.includes('/library/games')) return <GamesLibrary />;
    if (path.includes('/library/screen')) return <ScreenLibrary />;
    if (path.includes('/library/reads')) return <ReadsLibrary />;
    if (path.includes('/library/travels')) return <FieldnotesPage />;
    return <LibraryPage />;
  };
  
  const mainNavigation = [
    { id: 'home', name: 'Home', symbol: '◉' },
    { id: 'blogs', name: 'Blogs', symbol: '◈' },
    { id: 'projects', name: 'Projects', symbol: '⊙' },
    { id: 'library', name: 'Library', symbol: '⬢' },
    { id: 'whoami', name: 'About', symbol: '◆' },
  ];
  
  const logTabs = [
    { id: 'games', name: 'Games' },
    { id: 'movies', name: 'Movies' },
    { id: 'series', name: 'TV Series' },
    { id: 'books', name: 'Books' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const blogs = await fetchBlogs();
        const music = await fetchLogs('music');
        const games = await fetchLogs('games');
        const movies = await fetchLogs('movies');
        const series = await fetchLogs('series');
        const books = await fetchLogs('books');
        
        setEntries({
          blogs,
          music,
          games,
          movies,
          series,
          books
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isBlogPostPage && !isLogDetailPage && !isPlaylistPage && !isLegalPage) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isBlogPostPage, isLogDetailPage, isPlaylistPage, isLegalPage]);

  const getActiveLogEntries = () => {
    return entries[activeLogTab] || [];
  };

  // All create/update actions now live in the /admin panel

  // X/Twitter username (without @) from env, fallback to placeholder
  const twitterUsername =
    import.meta.env.VITE_X_USERNAME ||
    import.meta.env.VITE_TWITTER_USERNAME ||
    'yourusername';

  const renderHomePage = () => {
    if (loading) {
      return (
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content">
            <p>Fetching blog posts...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="homepage-layout">
        <div className="homepage-main">
          <div className="hero-banner">
            <img src="/palebluedot.jpg" alt="Pale Blue Dot" style={{ margin: 0 }} />
              <div className="hero-image-credit" style={{ textAlign: 'right', fontSize: '0.65em', color: '#888', marginTop: '2px', fontStyle: 'italic' }}>
                Image: Pale Blue Dot, NASA/JPL-Caltech
              </div>
          </div>

          <div className="post hero-section">
            <div className="post-content">
              <p>
                "I do not know what I may appear to the world, but to myself I seem to have been only like a boy playing on the seashore, finding a smoother pebble or a prettier shell than usual, while the great ocean of truth lay all undiscovered before me," said Newton, the greatest freaking mathematician, physicist, astronomer, alchemist and inventor of all time. If Newton believed his contributions were modest, what does that make us mere mortals? The pale blue dot taken by the Voyeger 1 is another example that comes to mind. Our whole wide world is just a spec of dust if observerd from far enough. All I can think of is Ygritte taunting Jon with, "You know nothing, Jon Snow."
              </p>
              <p>
                Now, what does any of this have to do with this website, you might ask. The answer is absolutely nothing. But since you're already here, feel free to explore my blogs and projects, and stay curious. Because, let's be real, you know nothing… and neither do I.
              </p>
            </div>
          </div>

          <div>
            <h3 className="post-section-title">
              Recent Blogs
            </h3>
            {entries.blogs.length === 0 ? (
              <div className="blog-card-empty">
                <p>No thoughts yet. Create your first post!</p>
              </div>
            ) : (
              <div className="blog-cards-grid">
                {entries.blogs.slice(0, 6).map((blog, index) => {
                  // Ancient symbols - all approximately same size
                  const symbols = [
                    '◉', // Circled dot
                    '◈', // Diamond with cross
                    '⬢', // Hexagon
                    '◐', // Half circle (moon phase)
                    '◑', // Inverted half circle
                    '◓', // Circle with quadrant
                    '⊚', // Circled ring
                    '⊛', // Circled asterisk
                    '⚶', // Trigram
                    '◆', // Filled diamond
                    '◇', // Empty diamond
                    '●', // Filled circle
                    '○', // Empty circle
                    '■', // Filled square
                    '□', // Empty square
                    '▲', // Filled triangle
                    '△', // Empty triangle
                    '⬟', // Pentagon
                    '⬠', // Pentagon outline
                    '⬡', // Hexagon outline
                    '◬' // Square with dots
                  ];
                  
                  // Deterministic symbol based on blog ID (consistent across renders)
                  const symbolIndex = blog._id ? String(blog._id).charCodeAt(0) % symbols.length : index % symbols.length;
                  const blogSymbol = symbols[symbolIndex];
                  
                  return (
                    <div 
                      key={blog._id} 
                      className="blog-card"
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      <div className="blog-card-icon">{blogSymbol}</div>
                      <h2 className="blog-card-title">{blog.title}</h2>
                      <div className="blog-card-meta">
                        <span className="blog-card-category">{blog.category || 'blogs'}</span>
                        <span className="blog-card-date">{new Date(blog.date).toLocaleDateString()}</span>
                      </div>
                      <div className="blog-card-excerpt">
                        {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </div>
                      <div className="blog-card-footer">
                        <span className="blog-card-link">Read →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <aside className="homepage-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              Latest Logs
            </h3>
            <p className="sidebar-section-text">What I've been consuming lately</p>
            <ul className="sidebar-list">
              {['music','games','movies','series','books'].map(cat => {
                const slice = (entries[cat] || []).slice(0,3);
                if (slice.length === 0) return null;
                return (
                  <li key={cat} className="sidebar-list-block">
                    <div className="sidebar-list-heading">{cat}</div>
                    <ul className="sidebar-sublist">
                      {slice.map(item => {
                        const getClickHandler = () => {
                          if (cat === 'music') {
                            return () => {
                              setActivePage('library');
                              navigate(`/library/music/${item.id}`);
                            };
                          }
                          return () => {
                            setActivePage('library');
                            navigate(`/library/${cat}/${item.id}`);
                          };
                        };
                        
                        return (
                          <li 
                            key={item._id || item.id} 
                            className="sidebar-sublist-item"
                            onClick={getClickHandler()}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="sidebar-item-title">{item.title}</span>
                            {item.rating && (
                              <span className="sidebar-item-meta">{item.rating}/5</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              Status
            </h3>
            <div className="sidebar-status">
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>Currently online</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    );
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="header-top">
            <h1 
              onClick={() => {
                setActivePage('home');
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="site-title"
              style={{ display: 'flex', alignItems: 'center', gap: '0.7em' }}
            >
              <span className="site-title-main">01100101</span>
              <span className="site-title-separator hide-mobile"> // </span>
              <span 
                className="site-title-subtitle hide-mobile"
                style={{ margin: 0, padding: 0 }}
              >
                thoughts and chaos
              </span>
            </h1>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
          
          <nav className={`navigation ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {mainNavigation.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    setActivePage(item.id);
                    navigate(`/${item.id === 'home' ? '' : item.id}`);
                    setMobileMenuOpen(false);
                  }}
                  className={activePage === item.id ? 'nav-link-active' : 'nav-link'}
                  data-symbol={item.symbol}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="nav-actions">
              {themeToggleButton}
            </div>
          </nav>
        </div>
      </header>

      <div className="container">
        <main>
          {isAdminPage ? (
            <AdminPanel />
          ) : isBlogPostPage ? (
            <BlogPost />
          ) : isLogDetailPage ? (
            <LogDetail />
          ) : isLegalPage ? (
            <>
              {location.pathname === '/terms' && <Terms />}
              {location.pathname === '/privacy' && <Privacy />}
              {location.pathname === '/disclaimer' && <Disclaimer />}
            </>
          ) : (
            <>
              {activePage === 'home' && renderHomePage()}
              {activePage === 'blogs' && <BlogsPage />}
              {activePage === 'library' && renderLibraryPage()}
              {activePage === 'projects' && <LabPage />}
              {activePage === 'whoami' && <WhoamiPage />}
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-brand">
              <span className="footer-title">01100101</span>
              <span className="footer-subtitle">thoughts and chaos</span>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">
              <span className="footer-symbol">△</span>
              Navigate
            </h4>
            <ul className="footer-links">
              <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
              <li><a href="/blogs" onClick={(e) => { e.preventDefault(); navigate('/blogs'); }}>Blogs</a></li>
              <li><a href="/projects" onClick={(e) => { e.preventDefault(); navigate('/projects'); }}>Projects</a></li>
              <li><a href="/library" onClick={(e) => { e.preventDefault(); navigate('/library'); }}>Library</a></li>
              <li><a href="/whoami" onClick={(e) => { e.preventDefault(); navigate('/whoami'); }}>About</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">
              <span className="footer-symbol">⊙</span>
              Connect
            </h4>
            <ul className="footer-links">
              <li><a href="https://github.com/karthi209" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://x.com/notkarthik" target="_blank" rel="noopener noreferrer">X / Twitter</a></li>
              <li><a href="mailto:hello@example.com">Email</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">
              <span className="footer-symbol">□</span>
              Legal
            </h4>
            <ul className="footer-links">
              <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms &amp; Conditions</a></li>
              <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a></li>
              <li><a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigate('/disclaimer'); }}>Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} definitely not karthik. Built with ignorance and curiosity.
          </p>
        </div>
      </footer>
    </div>
  );
}