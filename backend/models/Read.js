import pool from '../db.js';

export const Read = {
  // Initialize reads table
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reads (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        year INTEGER,
        genre VARCHAR(100),
        cover_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  async create(readData) {
    const { title, author, year, genre, cover_image_url } = readData;
    const result = await pool.query(
      `INSERT INTO reads (title, author, year, genre, cover_image_url) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, author, year, genre, cover_image_url]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM reads ORDER BY created_at DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM reads WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, readData) {
    const { title, author, year, genre, cover_image_url } = readData;
    const result = await pool.query(
      `UPDATE reads 
       SET title = $1, author = $2, year = $3, genre = $4, 
           cover_image_url = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING *`,
      [title, author, year, genre, cover_image_url, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM reads WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
