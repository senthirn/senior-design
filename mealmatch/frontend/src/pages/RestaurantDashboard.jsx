import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/restaurantService';

const RestaurantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMealForm, setShowMealForm] = useState(false);
  const [error, setError] = useState('');
  const [mealForm, setMealForm] = useState({
    title: '',
    description: '',
    mealType: 'lunch',
    originalPrice: '',
    discountedPrice: '',
    isFree: false,
    quantityAvailable: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (user?.role !== 'restaurant') {
      navigate('/');
      return;
    }
    loadRestaurantData();
  }, [user]);

  const loadRestaurantData = async () => {
    try {
      // Try to get restaurant from API
      try {
        const response = await restaurantService.getMyRestaurant();
        setRestaurant(response.data.restaurant);
        
        // Load meals
        const mealsResponse = await restaurantService.getRestaurantMeals(response.data.restaurant.id);
        setMeals(mealsResponse.data.meals || []);
      } catch (err) {
        // If restaurant doesn't exist, redirect to setup
        if (err.response?.status === 404) {
          navigate('/restaurant/setup');
          return;
        }
        throw err;
      }
    } catch (err) {
      setError('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const handleMealFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMealForm({
      ...mealForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateMeal = async (e) => {
    e.preventDefault();
    setError('');
  
    // Validate times
    const start = new Date(mealForm.startTime);
    const end = new Date(mealForm.endTime);
  
    if (end <= start) {
      setError('End time must be after start time');
      return;
    }
  
    setLoading(true);
  
    try {
      const mealData = {
        restaurantId: restaurant.id,
        title: mealForm.title,
        description: mealForm.description,
        mealType: mealForm.mealType,
        originalPrice: mealForm.isFree ? 0 : parseFloat(mealForm.originalPrice),
        discountedPrice: mealForm.isFree ? 0 : parseFloat(mealForm.discountedPrice),
        isFree: mealForm.isFree,
        quantityAvailable: mealForm.quantityAvailable ? parseInt(mealForm.quantityAvailable) : null,
        startTime: mealForm.startTime,
        endTime: mealForm.endTime,
      };
  
      await restaurantService.createMeal(mealData);
      
      // Reset form and reload meals
      setMealForm({
        title: '',
        description: '',
        mealType: 'lunch',
        originalPrice: '',
        discountedPrice: '',
        isFree: false,
        quantityAvailable: '',
        startTime: '',
        endTime: '',
      });
      setShowMealForm(false);
      loadRestaurantData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create meal');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    try {
      await restaurantService.deleteMeal(mealId);
      loadRestaurantData();
    } catch (err) {
      setError('Failed to delete meal');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 
            onClick={() => navigate('/')}
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea', cursor: 'pointer' }}
          >
            🍽️ MealMatch
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Restaurant Dashboard
          </h2>
          <p style={{ color: '#666' }}>Manage your meal deals and promotions</p>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
            {error}
          </div>
        )}

        {/* Restaurant Info */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            {restaurant?.name}
          </h3>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            Restaurant ID: {restaurant?.id}
          </p>
        </div>

        {/* Create Meal Button */}
        <button
          onClick={() => setShowMealForm(!showMealForm)}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#667eea', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}
        >
          {showMealForm ? '✕ Cancel' : '➕ Create New Meal Deal'}
        </button>

        {/* Meal Creation Form */}
        {showMealForm && (
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Create New Meal Deal
            </h3>
            
            <form onSubmit={handleCreateMeal}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Meal Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={mealForm.title}
                    onChange={handleMealFormChange}
                    required
                    placeholder="e.g., Lunch Special - Pizza & Salad"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={mealForm.description}
                    onChange={handleMealFormChange}
                    rows="3"
                    placeholder="Describe your meal deal..."
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Meal Type *
                  </label>
                  <select
                    name="mealType"
                    value={mealForm.mealType}
                    onChange={handleMealFormChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="any">Any Time</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    name="quantityAvailable"
                    value={mealForm.quantityAvailable}
                    onChange={handleMealFormChange}
                    placeholder="Leave empty for unlimited"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.75rem' }}>
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={mealForm.isFree}
                      onChange={handleMealFormChange}
                      style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>This is a FREE meal</span>
                  </label>
                </div>

                {!mealForm.isFree && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="originalPrice"
                        value={mealForm.originalPrice}
                        onChange={handleMealFormChange}
                        required={!mealForm.isFree}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        Discounted Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="discountedPrice"
                        value={mealForm.discountedPrice}
                        onChange={handleMealFormChange}
                        required={!mealForm.isFree}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={mealForm.startTime}
                    onChange={handleMealFormChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={mealForm.endTime}
                    onChange={handleMealFormChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  backgroundColor: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Create Meal Deal
              </button>
            </form>
          </div>
        )}

        {/* Meals List */}
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Your Meal Deals ({meals.length})
          </h3>

          {meals.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: '#666', fontSize: '1.125rem' }}>
                No meal deals yet. Create your first one to get started!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {meals.map((meal) => (
                <div 
                  key={meal.id}
                  style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {meal.title}
                    </h4>
                    {meal.description && (
                      <p style={{ color: '#666', marginBottom: '0.5rem' }}>{meal.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                      <span>🍽️ {meal.meal_type}</span>
                      {meal.quantity_available && <span>📦 Qty: {meal.quantity_available}</span>}
                      <span className={meal.is_active ? 'text-green-600' : 'text-red-600'}>
                        {meal.is_active ? '✓ Active' : '✗ Inactive'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      <div>Start: {new Date(meal.start_time).toLocaleString()}</div>
                      <div>End: {new Date(meal.end_time).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                    {meal.is_free ? (
                      <span style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: '#10b98120', 
                        color: '#10b981', 
                        borderRadius: '4px', 
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}>
                        FREE
                      </span>
                    ) : (
                      <div>
                        {meal.original_price && (
                          <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.875rem' }}>
                            ${meal.original_price}
                          </div>
                        )}
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#667eea' }}>
                          ${meal.discounted_price}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard;