import express from 'express';
import { Game } from '../models/Game.js';
import { GameLog } from '../models/GameLog.js';

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.getAll();
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.getById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// Get all game logs
router.get('/logs/all', async (req, res) => {
  try {
    const logs = await GameLog.getAll();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching game logs:', error);
    res.status(500).json({ error: 'Failed to fetch game logs' });
  }
});

// Get logs for a specific game
router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await GameLog.getByGameId(req.params.id);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching game logs:', error);
    res.status(500).json({ error: 'Failed to fetch game logs' });
  }
});

// Get single game log by ID
router.get('/logs/:id', async (req, res) => {
  try {
    const log = await GameLog.getById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Game log not found' });
    }
    res.json(log);
  } catch (error) {
    console.error('Error fetching game log:', error);
    res.status(500).json({ error: 'Failed to fetch game log' });
  }
});

export default router;
