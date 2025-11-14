import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'portfolio_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables - now handled by models
export const initDatabase = async () => {
  try {
    // Import models
    const { Blog } = await import('./models/Blog.js');
    const { Playlist } = await import('./models/Playlist.js');
    const { PlaylistSong } = await import('./models/PlaylistSong.js');
    const { Game } = await import('./models/Game.js');
    const { GameLog } = await import('./models/GameLog.js');
    const { Screen } = await import('./models/Screen.js');
    const { ScreenLog } = await import('./models/ScreenLog.js');
    const { Read } = await import('./models/Read.js');
    const { ReadLog } = await import('./models/ReadLog.js');
    const { Travel } = await import('./models/Travel.js');
    const { TravelLog } = await import('./models/TravelLog.js');

    // Initialize all tables
    await Blog.init();
    await Playlist.init();
    await PlaylistSong.init();
    await Game.init();
    await GameLog.init();
    await Screen.init();
    await ScreenLog.init();
    await Read.init();
    await ReadLog.init();
    await Travel.init();
    await TravelLog.init();

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool;

