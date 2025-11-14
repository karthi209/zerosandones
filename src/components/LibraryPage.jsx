import { useNavigate } from 'react-router-dom';

export default function LibraryPage() {
  const navigate = useNavigate();

  const libraries = [
    {
      id: 'music',
      name: 'Music',
      description: 'Playlists, albums, and songs that define my soundtrack',
      path: '/library/music',
      icon: '♫'
    },
    {
      id: 'games',
      name: 'Games',
      description: 'Games I have played, reviewed, and cannot stop thinking about',
      path: '/library/games',
      icon: '⌘'
    },
    {
      id: 'screen',
      name: 'Screen',
      description: 'Movies and TV series worth watching',
      path: '/library/screen',
      icon: '▶'
    },
    {
      id: 'reads',
      name: 'Reads',
      description: 'Books that changed my perspective',
      path: '/library/reads',
      icon: '◈'
    },
    {
      id: 'travels',
      name: 'Travels',
      description: 'Places visited, journeys taken, and adventures documented',
      path: '/library/travels',
      icon: '✈'
    }
  ];

  return (
    <div className="container">
      <div className="post">
        <h2 className="post-section-title">Library</h2>
        <p className="post-content">
          My personal collection of everything I consume, create, and explore. 
          From music to games, screens to reads, and travels to distant places.
        </p>
      </div>

      <div className="myverse-hub-grid">
        {libraries.slice(0, 4).map((library) => (
          <div
            key={library.id}
            className="myverse-hub-card"
            onClick={() => navigate(library.path)}
          >
            <div className="myverse-hub-icon">{library.icon}</div>
            <h3 className="myverse-hub-title">{library.name}</h3>
            <p className="myverse-hub-description">{library.description}</p>
            <span className="myverse-hub-link">Explore →</span>
          </div>
        ))}
      </div>

      <div className="myverse-hub-grid" style={{ marginTop: 'var(--space-xl)' }}>
        {libraries.slice(4).map((library) => (
          <div
            key={library.id}
            className="myverse-hub-card"
            onClick={() => navigate(library.path)}
            style={{ gridColumn: '1 / -1' }}
          >
            <div className="myverse-hub-icon">{library.icon}</div>
            <h3 className="myverse-hub-title">{library.name}</h3>
            <p className="myverse-hub-description">{library.description}</p>
            <span className="myverse-hub-link">Explore →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
