import pool from '../db.js';

export const ScreenLog = {
  // Initialize screen_logs table
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS screen_logs (
        id SERIAL PRIMARY KEY,
        screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        status VARCHAR(50),
        review TEXT,
        watched_on DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_screen_logs_screen_id ON screen_logs(screen_id);
      CREATE INDEX IF NOT EXISTS idx_screen_logs_watched_on ON screen_logs(watched_on DESC);
    `);
  },

  async create(logData) {
    const { screen_id, rating, status, review, watched_on } = logData;
    const result = await pool.query(
      `INSERT INTO screen_logs (screen_id, rating, status, review, watched_on) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [screen_id, rating, status, review, watched_on]
    );
    return result.rows[0];
  },

  async findByScreenId(screenId) {
    const result = await pool.query(
      'SELECT * FROM screen_logs WHERE screen_id = $1 ORDER BY watched_on DESC',
      [screenId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM screen_logs WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, logData) {
    const { rating, status, review, watched_on } = logData;
    const result = await pool.query(
      `UPDATE screen_logs 
       SET rating = $1, status = $2, review = $3, watched_on = $4, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [rating, status, review, watched_on, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM screen_logs WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
