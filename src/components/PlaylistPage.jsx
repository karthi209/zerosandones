import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MusicLibrary.css';

export default function PlaylistPage({ id }) {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const url = apiUrl.endsWith('/api') ? `${apiUrl}/playlists` : `${apiUrl}/api/playlists`;
        console.log('Fetching from:', url);
        console.log('Looking for playlist ID:', id, 'type:', typeof id);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch playlists');
        const data = await response.json();
        console.log('Fetched playlists:', data);
        console.log('Playlist IDs in response:', data.map(p => ({ id: p.id, type: typeof p.id })));
        const found = data.find(p => p.id === parseInt(id));
        console.log('Found playlist:', found);
        console.log('Playlist songs:', found?.songs);
        
        if (!found) {
          setError('Playlist not found');
        } else {
          setPlaylist(found);
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError('Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="post">
          <h2 className="post-title">Loading...</h2>
          <div className="post-content"><p>Fetching playlist...</p></div>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="container">
        <div className="post">
          <Link to="/library/music" className="back-link">← Back to Playlists</Link>
          <h2 className="post-title">{error || 'Playlist not found'}</h2>
        </div>
      </div>
    );
  }

  const songCount = playlist.songs ? playlist.songs.length : 0;

  const openInSpotify = () => {
    if (playlist.spotify_url) {
      window.open(playlist.spotify_url, '_blank');
    } else {
      const query = encodeURIComponent(`${playlist.name} playlist`);
      window.open(`https://open.spotify.com/search/${query}`, '_blank');
    }
  };

  const openInYouTubeMusic = () => {
    if (playlist.youtube_music_url) {
      window.open(playlist.youtube_music_url, '_blank');
    } else {
      const query = encodeURIComponent(`${playlist.name} playlist`);
      window.open(`https://music.youtube.com/search?q=${query}`, '_blank');
    }
  };

  return (
    <div className="container">
      <article className="post">
        <header className="post-header">
          <Link to="/library/music" className="back-link">← Back to Playlists</Link>
          <h1 className="post-title">{playlist.name}</h1>
          <div className="post-meta">
            <span className="playlist-count">{songCount} {songCount === 1 ? 'song' : 'songs'}</span>
          </div>
        </header>
        
        {playlist.description && (
          <div className="post-content">
            <p className="playlist-description-full">{playlist.description}</p>
          </div>
        )}
        
        <div className="playlist-actions">
          <button onClick={openInSpotify} className="playlist-action-btn" title="Open in Spotify">
            <span className="action-icon">♫</span>
            <span>Spotify</span>
          </button>
          <button onClick={openInYouTubeMusic} className="playlist-action-btn" title="Open in YouTube Music">
            <span className="action-icon">▶</span>
            <span>YouTube Music</span>
          </button>
        </div>

        <div className="post-content">
          {songCount === 0 ? (
            <p>No songs in this playlist yet.</p>
          ) : (
            <div className="songs-list">
              {playlist.songs.map((s, idx) => (
                <div className="song-item" key={s.id}>
                  <div className="song-number">{idx + 1}</div>
                  <div className="song-info">
                    <div className="song-title">{s.title}</div>
                    <div className="song-meta">
                      {s.artist}
                      {s.album && ` — ${s.album}`}
                      {s.year && ` (${s.year})`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
