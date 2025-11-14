import { Router } from 'express';
import { Game } from '../models/Game.js';
import { GameLog } from '../models/GameLog.js';
import { Screen } from '../models/Screen.js';
import { ScreenLog } from '../models/ScreenLog.js';
import { Read } from '../models/Read.js';
import { ReadLog } from '../models/ReadLog.js';
import { Playlist } from '../models/Playlist.js';

const router = Router();

// Get all logs (backward compatibility endpoint)
router.get('/', async (req, res) => {
  try {
    // Aggregate all recent logs from different tables
    const results = [];
    
    // Get game logs with game info
    const games = await Game.findAll();
    for (const game of games.slice(0, 10)) {
      const logs = await GameLog.findByGameId(game.id);
      if (logs.length > 0) {
        const latestLog = logs[0];
        results.push({
          _id: game.id,
          id: game.id,
          title: game.title,
          type: 'games',
          rating: latestLog.rating?.toString(),
          date: latestLog.created_at
        });
      }
    }
    
    res.json(results);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get logs by type (backward compatibility)
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const results = [];
    
    switch (type) {
      case 'music':
        // Music is now playlists
        const playlists = await Playlist.findAll();
        results.push(...playlists.map(p => ({
          _id: p.id,
          id: p.id,
          title: p.name,
          type: 'music',
          rating: null,
          date: p.created_at
        })));
        break;
        
      case 'games':
        const games = await Game.findAll();
        for (const game of games) {
          const logs = await GameLog.findByGameId(game.id);
          const latestLog = logs[0];
          results.push({
            _id: game.id,
            id: game.id,
            title: game.title,
            type: 'games',
            rating: latestLog?.rating?.toString(),
            status: latestLog?.status,
            date: latestLog?.created_at || game.created_at
          });
        }
        break;
        
      case 'movies':
        const movies = await Screen.findAll('movie');
        for (const movie of movies) {
          const logs = await ScreenLog.findByScreenId(movie.id);
          const latestLog = logs[0];
          results.push({
            _id: movie.id,
            id: movie.id,
            title: movie.title,
            type: 'movies',
            rating: latestLog?.rating?.toString(),
            status: latestLog?.status,
            date: latestLog?.created_at || movie.created_at
          });
        }
        break;
        
      case 'series':
        const series = await Screen.findAll('series');
        for (const show of series) {
          const logs = await ScreenLog.findByScreenId(show.id);
          const latestLog = logs[0];
          results.push({
            _id: show.id,
            id: show.id,
            title: show.title,
            type: 'series',
            rating: latestLog?.rating?.toString(),
            status: latestLog?.status,
            date: latestLog?.created_at || show.created_at
          });
        }
        break;
        
      case 'books':
        const books = await Read.findAll();
        for (const book of books) {
          const logs = await ReadLog.findByReadId(book.id);
          const latestLog = logs[0];
          results.push({
            _id: book.id,
            id: book.id,
            title: book.title,
            type: 'books',
            author: book.author,
            rating: latestLog?.rating?.toString(),
            status: latestLog?.status,
            date: latestLog?.created_at || book.created_at
          });
        }
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid log type' });
    }
    
    res.json(results);
  } catch (err) {
    console.error('Error fetching logs by type:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
