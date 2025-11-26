import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/restaurantService';

const RestaurantSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    lat: '',
    lng: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await restaurantService.createRestaurant(formData);
      navigate('/restaurant/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
            🍽️ MealMatch
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Restaurant Setup
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Let's get your restaurant set up so you can start posting meal deals!
          </p>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Restaurant Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Joe's Pizza"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Address */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main Street"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            {/* City, State, Zip */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Cincinnati"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="OH"
                  maxLength="2"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Zip Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="45202"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Location Coordinates *
              </label>
              <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                We need your exact location to show your restaurant on the map.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  placeholder="Latitude (e.g., 39.1031)"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  placeholder="Longitude (e.g., -84.5120)"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                style={{ 
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                📍 Use My Current Location
              </button>
            </div>

            {/* Help Text */}
            <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                💡 <strong>Tip:</strong> If you don't know your coordinates, you can use Google Maps:
                <br />1. Find your restaurant on Google Maps
                <br />2. Right-click on the location
                <br />3. Click the coordinates to copy them
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '0.75rem', 
                backgroundColor: loading ? '#ccc' : '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RestaurantSetup;