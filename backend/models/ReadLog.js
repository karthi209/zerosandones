import pool from '../db.js';

export const ReadLog = {
  // Initialize read_logs table
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS read_logs (
        id SERIAL PRIMARY KEY,
        read_id INTEGER NOT NULL REFERENCES reads(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        status VARCHAR(50),
        review TEXT,
        finished_on DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_read_logs_read_id ON read_logs(read_id);
      CREATE INDEX IF NOT EXISTS idx_read_logs_finished_on ON read_logs(finished_on DESC);
    `);
  },

  async create(logData) {
    const { read_id, rating, status, review, finished_on } = logData;
    const result = await pool.query(
      `INSERT INTO read_logs (read_id, rating, status, review, finished_on) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [read_id, rating, status, review, finished_on]
    );
    return result.rows[0];
  },

  async findByReadId(readId) {
    const result = await pool.query(
      'SELECT * FROM read_logs WHERE read_id = $1 ORDER BY finished_on DESC',
      [readId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM read_logs WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, logData) {
    const { rating, status, review, finished_on } = logData;
    const result = await pool.query(
      `UPDATE read_logs 
       SET rating = $1, status = $2, review = $3, finished_on = $4, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [rating, status, review, finished_on, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM read_logs WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
