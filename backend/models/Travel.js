import pool from '../db.js';

export const Travel = {
  // Initialize travels table
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS travels (
        id SERIAL PRIMARY KEY,
        destination VARCHAR(255) NOT NULL,
        country VARCHAR(100),
        travel_type VARCHAR(50),
        cover_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_travels_country ON travels(country);
    `);
  },

  async create(travelData) {
    const { destination, country, travel_type, cover_image_url } = travelData;
    const result = await pool.query(
      `INSERT INTO travels (destination, country, travel_type, cover_image_url) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [destination, country, travel_type, cover_image_url]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM travels ORDER BY created_at DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM travels WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, travelData) {
    const { destination, country, travel_type, cover_image_url } = travelData;
    const result = await pool.query(
      `UPDATE travels 
       SET destination = $1, country = $2, travel_type = $3, 
           cover_image_url = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [destination, country, travel_type, cover_image_url, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM travels WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
