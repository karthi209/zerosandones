import express from 'express';
import { Travel } from '../models/Travel.js';
import { TravelLog } from '../models/TravelLog.js';

const router = express.Router();

// Get all travels
router.get('/', async (req, res) => {
  try {
    const travels = await Travel.getAll();
    res.json(travels);
  } catch (error) {
    console.error('Error fetching travels:', error);
    res.status(500).json({ error: 'Failed to fetch travels' });
  }
});

// Get travel by ID
router.get('/:id', async (req, res) => {
  try {
    const travel = await Travel.getById(req.params.id);
    if (!travel) {
      return res.status(404).json({ error: 'Travel not found' });
    }
    res.json(travel);
  } catch (error) {
    console.error('Error fetching travel:', error);
    res.status(500).json({ error: 'Failed to fetch travel' });
  }
});

// Get all travel logs
router.get('/logs/all', async (req, res) => {
  try {
    const logs = await TravelLog.getAll();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching travel logs:', error);
    res.status(500).json({ error: 'Failed to fetch travel logs' });
  }
});

// Get logs for a specific travel
router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await TravelLog.getByTravelId(req.params.id);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching travel logs:', error);
    res.status(500).json({ error: 'Failed to fetch travel logs' });
  }
});

// Get single travel log by ID
router.get('/logs/:id', async (req, res) => {
  try {
    const log = await TravelLog.getById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Travel log not found' });
    }
    res.json(log);
  } catch (error) {
    console.error('Error fetching travel log:', error);
    res.status(500).json({ error: 'Failed to fetch travel log' });
  }
});

export default router;
