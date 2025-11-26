import { query } from '../config/database.js';

// Get user's shelter
export const getMyShelter = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM shelters WHERE owner_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shelter not found' });
    }

    res.json({ shelter: result.rows[0] });
  } catch (error) {
    console.error('Get shelter error:', error);
    res.status(500).json({ error: 'Failed to fetch shelter' });
  }
};

// Create shelter
export const createShelter = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      phone,
      lat,
      lng,
      totalBeds,
      servicesOffered,
      breakfastTime,
      lunchTime,
      dinnerTime,
    } = req.body;

    if (!name || !address || !city || !lat || !lng || !totalBeds) {
      return res.status(400).json({
        error: 'Name, address, city, location coordinates, and total beds are required'
      });
    }

    // Check if shelter already exists for this user
    const existing = await query(
      'SELECT id FROM shelters WHERE owner_id = $1',
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Shelter already exists for this user' });
    }

    const result = await query(
      `INSERT INTO shelters (
        owner_id, name, address, city, state, zip_code, phone,
        location, total_beds, available_beds, services_offered,
        breakfast_time, lunch_time, dinner_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326), $10, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        req.user.id, name, address, city, state, zipCode, phone,
        lng, lat, totalBeds, servicesOffered,
        breakfastTime, lunchTime, dinnerTime
      ]
    );

    res.status(201).json({
      message: 'Shelter created successfully',
      shelter: result.rows[0]
    });
  } catch (error) {
    console.error('Create shelter error:', error);
    res.status(500).json({ error: 'Failed to create shelter' });
  }
};

// Update shelter
export const updateShelter = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check ownership
    const shelterCheck = await query(
      'SELECT id FROM shelters WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    );

    if (shelterCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && key !== 'id' && key !== 'owner_id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE shelters SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      message: 'Shelter updated successfully',
      shelter: result.rows[0]
    });
  } catch (error) {
    console.error('Update shelter error:', error);
    res.status(500).json({ error: 'Failed to update shelter' });
  }
};

// Update availability
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availableBeds } = req.body;

    if (availableBeds === undefined) {
      return res.status(400).json({ error: 'Available beds is required' });
    }

    // Check ownership
    const shelterCheck = await query(
      'SELECT id, total_beds FROM shelters WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    );

    if (shelterCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const totalBeds = shelterCheck.rows[0].total_beds;

    if (availableBeds < 0 || availableBeds > totalBeds) {
      return res.status(400).json({
        error: `Available beds must be between 0 and ${totalBeds}`
      });
    }

    const result = await query(
      `UPDATE shelters 
       SET available_beds = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [availableBeds, id]
    );

    res.json({
      message: 'Availability updated successfully',
      shelter: result.rows[0]
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

// Get all active shelters (public)
export const getAllShelters = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    let queryText = `
      SELECT 
        s.*,
        ST_AsText(s.location) as location_text
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (lat && lng) {
      queryText += `,
        ST_Distance(
          s.location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 as distance_km
      `;
      queryParams.push(lng, lat);
      paramIndex = 3;
    }

    queryText += `
      FROM shelters s
      WHERE s.is_active = TRUE
    `;

    if (lat && lng) {
      queryText += `
        AND ST_DWithin(
          s.location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $${paramIndex} * 1000
        )
      `;
      queryParams.push(radius);
    }

    queryText += `
      ORDER BY ${lat && lng ? 'distance_km ASC' : 's.name ASC'}
    `;

    const result = await query(queryText, queryParams);

    res.json({
      shelters: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get shelters error:', error);
    res.status(500).json({ error: 'Failed to fetch shelters' });
  }
};

// Delete shelter
export const deleteShelter = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check ownership
      const shelterCheck = await query(
        'SELECT id FROM shelters WHERE id = $1 AND owner_id = $2',
        [id, req.user.id]
      );
  
      if (shelterCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Permission denied' });
      }
  
      // Soft delete - set is_active to false
      await query(
        'UPDATE shelters SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
  
      res.json({ message: 'Shelter deleted successfully' });
    } catch (error) {
      console.error('Delete shelter error:', error);
      res.status(500).json({ error: 'Failed to delete shelter' });
    }
  };

export default {
  getMyShelter,
  createShelter,
  updateShelter,
  updateAvailability,
  getAllShelters, 
  deleteShelter
};