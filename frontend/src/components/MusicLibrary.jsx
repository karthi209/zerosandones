import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MusicLibrary.css';

export default function MusicLibrary() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const url = `${apiUrl}/playlists`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch playlists');
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content"><p>Fetching playlists...</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="post">
        <h2 className="post-section-title">Playlists</h2>
        <p className="post-content">
          Curated playlists of songs that shaped my vibe. Each playlist tells a story —
          from late-night coding sessions to nostalgic throwbacks.
        </p>
      </section>

      {playlists.length === 0 ? (
        <section className="post">
          <p className="post-content">No playlists yet. Check back soon!</p>
        </section>
      ) : (
        playlists.map((p) => {
          const songCount = p.songs ? p.songs.length : 0;
          
          return (
            <section className="post playlist" key={p.id}>
              <Link to={`/library/music/${p.id}`} className="playlist-link">
                <header className="playlist-header">
                  <div className="playlist-header-main">
                    <div className="playlist-title-row">
                      <h3 className="playlist-name">{p.name}</h3>
                      <span className="playlist-count">{songCount} {songCount === 1 ? 'song' : 'songs'}</span>
                    </div>
                    {p.description && (
                      <p className="playlist-description">{p.description}</p>
                    )}
                  </div>
                  <div className="playlist-arrow">→</div>
                </header>
              </Link>
            </section>
          );
        })
      )}
    </div>
  );
}
