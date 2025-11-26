import { query } from '../config/database.js';

// Search meals with location filtering
export const searchMeals = async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 10,
      mealType,
      isFree,
      limit = 20,
      offset = 0
    } = req.query;

    let queryText = `
      SELECT 
        m.*,
        r.name as restaurant_name,
        r.address as restaurant_address,
        r.city as restaurant_city,
        r.rating as restaurant_rating
    `;

    if (lat && lng) {
      queryText += `,
        ST_Distance(
          r.location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 as distance_km
      `;
    }

    queryText += `
      FROM meals m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE m.is_active = TRUE
        AND r.is_active = TRUE
        AND m.start_time <= CURRENT_TIMESTAMP
        AND m.end_time >= CURRENT_TIMESTAMP
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (lat && lng) {
      queryParams.push(lng, lat);
      paramIndex = 3;
      
      queryText += `
        AND ST_DWithin(
          r.location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $${paramIndex} * 1000
        )
      `;
      queryParams.push(radius);
      paramIndex++;
    }

    if (mealType) {
      queryText += ` AND m.meal_type = $${paramIndex}`;
      queryParams.push(mealType);
      paramIndex++;
    }

    if (isFree === 'true') {
      queryText += ` AND m.is_free = TRUE`;
    }

    queryText += `
      ORDER BY ${lat && lng ? 'distance_km ASC' : 'm.created_at DESC'}
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);

    res.json({
      meals: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Search meals error:', error);
    res.status(500).json({ error: 'Failed to search meals' });
  }
};

// Get meal by ID
export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        m.*,
        r.id as restaurant_id,
        r.name as restaurant_name,
        r.address as restaurant_address,
        r.city as restaurant_city,
        r.phone as restaurant_phone,
        r.rating as restaurant_rating
      FROM meals m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({ meal: result.rows[0] });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
};

// Create meal (Restaurant only)
export const createMeal = async (req, res) => {
  try {
    const {
      restaurantId,
      title,
      description,
      mealType,
      originalPrice,
      discountedPrice,
      isFree,
      quantityAvailable,
      dietaryTags,
      startTime,
      endTime,
    } = req.body;

    if (!restaurantId || !title || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Restaurant ID, title, start time, and end time are required' 
      });
    }

    // Check if user owns the restaurant
    const restaurantCheck = await query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (restaurantCheck.rows.length === 0) {
      return res.status(403).json({ 
        error: 'You do not have permission to create meals for this restaurant' 
      });
    }

    const result = await query(
      `INSERT INTO meals (
        restaurant_id, title, description, meal_type,
        original_price, discounted_price, is_free,
        quantity_available, dietary_tags,
        start_time, end_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        restaurantId, title, description, mealType,
        originalPrice, discountedPrice, isFree || false,
        quantityAvailable, dietaryTags,
        startTime, endTime
      ]
    );

    const meal = result.rows[0];

    res.status(201).json({
      message: 'Meal created successfully',
      meal
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
};

// Update meal
export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const mealCheck = await query(
      `SELECT m.id FROM meals m
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE m.id = $1 AND r.owner_id = $2`,
      [id, req.user.id]
    );

    if (mealCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
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
      `UPDATE meals SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      message: 'Meal updated successfully',
      meal: result.rows[0]
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
};

// Delete meal
export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;

    const mealCheck = await query(
      `SELECT m.id FROM meals m
       JOIN restaurants r ON m.restaurant_id = r.id
       WHERE m.id = $1 AND r.owner_id = $2`,
      [id, req.user.id]
    );

    if (mealCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await query(
      'UPDATE meals SET is_active = FALSE WHERE id = $1',
      [id]
    );

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
};

// Get meals for a restaurant
export const getRestaurantMeals = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Check if user owns the restaurant
    const restaurantCheck = await query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurantId, req.user.id]
    );

    if (restaurantCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const result = await query(
      `SELECT * FROM meals 
       WHERE restaurant_id = $1 
       ORDER BY created_at DESC`,
      [restaurantId]
    );

    res.json({ meals: result.rows });
  } catch (error) {
    console.error('Get restaurant meals error:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
};

export default {
  searchMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getRestaurantMeals
};