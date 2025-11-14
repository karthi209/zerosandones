// Simple admin password authentication middleware
export const authenticateApiKey = async (req, res, next) => {
  try {
    const providedKey = req.headers['x-api-key'] || req.query.api_key;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (!providedKey) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (providedKey !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};
