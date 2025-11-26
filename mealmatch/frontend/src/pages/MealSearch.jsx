import { useState } from 'react';
import { mealService } from '../services/mealService';
import { useNavigate } from 'react-router-dom';
import MealMap from '../components/MealMap';

const MealSearch = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    lat: '',
    lng: '',
    radius: '10',
    mealType: '',
    isFree: false,
  });
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = {};
      if (filters.lat) params.lat = filters.lat;
      if (filters.lng) params.lng = filters.lng;
      if (filters.radius) params.radius = filters.radius;
      if (filters.mealType) params.mealType = filters.mealType;
      if (filters.isFree) params.isFree = 'true';

      const response = await mealService.searchMeals(params);
      setMeals(response.data.meals || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search meals');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters({
            ...filters,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6),
          });
        },
        (error) => {
          setError('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

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
          <button
            onClick={() => navigate('/')}
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
            Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
          Search for Meals
        </h2>

        {/* Search Form */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={filters.lat}
                  onChange={(e) => setFilters({ ...filters, lat: e.target.value })}
                  placeholder="40.7128"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={filters.lng}
                  onChange={(e) => setFilters({ ...filters, lng: e.target.value })}
                  placeholder="-74.0060"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Radius (km)
                </label>
                <input
                  type="number"
                  value={filters.radius}
                  onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Meal Type
                </label>
                <select
                  value={filters.mealType}
                  onChange={(e) => setFilters({ ...filters, mealType: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">All</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.isFree}
                  onChange={(e) => setFilters({ ...filters, isFree: e.target.checked })}
                  style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Free meals only</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={getCurrentLocation}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📍 Use My Location
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: loading ? '#ccc' : '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Searching...' : '🔍 Search Meals'}
              </button>
            </div>
          </form>

          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
              {error}
            </div>
          )}
        </div>
        {/* Map */}
        {meals.length > 0 && filters.lat && filters.lng && (
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                Map View
                </h3>
                <MealMap 
                meals={meals}
                center={{ lat: parseFloat(filters.lat), lng: parseFloat(filters.lng) }}
                zoom={13}
                />
            </div>
        )}

        {/* Results */}
        {meals.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Found {meals.length} meal(s)
            </h3>
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
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                      {meal.title}
                    </h4>
                    <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      📍 {meal.restaurant_name} • {meal.restaurant_city}
                    </p>
                    {meal.description && (
                      <p style={{ color: '#666', marginBottom: '0.5rem' }}>{meal.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#666' }}>
                      {meal.meal_type && <span>🍽️ {meal.meal_type}</span>}
                      {meal.distance_km && <span>📏 {parseFloat(meal.distance_km).toFixed(1)} km away</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
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
                          <span style={{ 
                            textDecoration: 'line-through', 
                            color: '#999', 
                            fontSize: '0.875rem',
                            marginRight: '0.5rem'
                          }}>
                            ${meal.original_price}
                          </span>
                        )}
                        <span style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '600', 
                          color: '#667eea' 
                        }}>
                          ${meal.discounted_price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && meals.length === 0 && filters.lat && (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: '#666' }}>
              No meals found in your area. Try adjusting your search filters!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MealSearch;