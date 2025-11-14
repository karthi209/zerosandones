import pool from '../db.js';

export const Playlist = {
  // Initialize playlists table
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        spotify_url TEXT,
        youtube_music_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  // Create a new playlist
  async create(playlistData) {
    const { name, description, spotify_url, youtube_music_url } = playlistData;
    const result = await pool.query(
      `INSERT INTO playlists (name, description, spotify_url, youtube_music_url) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, description, spotify_url, youtube_music_url]
    );
    return result.rows[0];
  },

  // Find all playlists
  async findAll() {
    const result = await pool.query('SELECT * FROM playlists ORDER BY created_at DESC');
    return result.rows;
  },

  // Find playlist by ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM playlists WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Update playlist
  async update(id, playlistData) {
    const { name, description, spotify_url, youtube_music_url } = playlistData;
    const result = await pool.query(
      `UPDATE playlists 
       SET name = $1, description = $2, spotify_url = $3, youtube_music_url = $4, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [name, description, spotify_url, youtube_music_url, id]
    );
    return result.rows[0];
  },

  // Delete playlist (cascade will delete songs)
  async delete(id) {
    const result = await pool.query('DELETE FROM playlists WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
