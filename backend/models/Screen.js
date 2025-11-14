import pool from '../db.js';

export const Screen = {
  // Initialize screens table
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS screens (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('movie', 'series')),
        year INTEGER,
        director VARCHAR(255),
        genre VARCHAR(100),
        cover_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  async create(screenData) {
    const { title, type, year, director, genre, cover_image_url } = screenData;
    const result = await pool.query(
      `INSERT INTO screens (title, type, year, director, genre, cover_image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, type, year, director, genre, cover_image_url]
    );
    return result.rows[0];
  },

  async findAll(type = null) {
    let query = 'SELECT * FROM screens';
    const params = [];
    
    if (type) {
      query += ' WHERE type = $1';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM screens WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, screenData) {
    const { title, type, year, director, genre, cover_image_url } = screenData;
    const result = await pool.query(
      `UPDATE screens 
       SET title = $1, type = $2, year = $3, director = $4, 
           genre = $5, cover_image_url = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 
       RETURNING *`,
      [title, type, year, director, genre, cover_image_url, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM screens WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
