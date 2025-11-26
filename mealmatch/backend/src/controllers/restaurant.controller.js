import { query } from '../config/database.js';

// Get user's restaurant
export const getMyRestaurant = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ restaurant: result.rows[0] });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

// Create restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, city, state, zipCode, phone, lat, lng } = req.body;

    if (!name || !address || !city || !lat || !lng) {
      return res.status(400).json({ 
        error: 'Name, address, city, latitude, and longitude are required' 
      });
    }

    // Check if restaurant already exists for this user
    const existing = await query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Restaurant already exists for this user' });
    }

    const result = await query(
      `INSERT INTO restaurants (
        owner_id, name, address, city, state, zip_code, phone,
        location
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326))
      RETURNING *`,
      [req.user.id, name, address, city, state, zipCode, phone, lng, lat]
    );

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: result.rows[0]
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

export default { getMyRestaurant, createRestaurant };