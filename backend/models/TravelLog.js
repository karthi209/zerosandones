import pool from '../db.js';

export const TravelLog = {
  // Initialize travel_logs table
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS travel_logs (
        id SERIAL PRIMARY KEY,
        travel_id INTEGER NOT NULL REFERENCES travels(id) ON DELETE CASCADE,
        start_date DATE,
        end_date DATE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        highlights TEXT,
        visited_on DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_travel_logs_travel_id ON travel_logs(travel_id);
      CREATE INDEX IF NOT EXISTS idx_travel_logs_visited_on ON travel_logs(visited_on DESC);
    `);
  },

  async create(logData) {
    const { travel_id, start_date, end_date, rating, review, highlights, visited_on } = logData;
    const result = await pool.query(
      `INSERT INTO travel_logs (travel_id, start_date, end_date, rating, review, highlights, visited_on) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [travel_id, start_date, end_date, rating, review, highlights, visited_on]
    );
    return result.rows[0];
  },

  async findByTravelId(travelId) {
    const result = await pool.query(
      'SELECT * FROM travel_logs WHERE travel_id = $1 ORDER BY visited_on DESC',
      [travelId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM travel_logs WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, logData) {
    const { start_date, end_date, rating, review, highlights, visited_on } = logData;
    const result = await pool.query(
      `UPDATE travel_logs 
       SET start_date = $1, end_date = $2, rating = $3, review = $4, 
           highlights = $5, visited_on = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 
       RETURNING *`,
      [start_date, end_date, rating, review, highlights, visited_on, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM travel_logs WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
