import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ShelterSearch = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    lat: '',
    lng: '',
    radius: '10',
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

      const response = await api.get('/api/shelters', { params });
      setShelters(response.data.shelters || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search shelters');
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
          Search for Shelters
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
                {loading ? 'Searching...' : '🔍 Search Shelters'}
              </button>
            </div>
          </form>

          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {shelters.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Found {shelters.length} shelter(s)
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {shelters.map((shelter) => (
                <div 
                  key={shelter.id} 
                  style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                        {shelter.name}
                      </h4>
                      <p style={{ color: '#666', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        📍 {shelter.address}, {shelter.city}, {shelter.state} {shelter.zip_code}
                      </p>
                      <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        📞 {shelter.phone}
                      </p>
                      {shelter.distance_km && (
                        <p style={{ color: '#666', fontSize: '0.875rem' }}>
                          📏 {parseFloat(shelter.distance_km).toFixed(1)} km away
                        </p>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: shelter.available_beds > 0 ? '#10b98120' : '#fee', 
                        color: shelter.available_beds > 0 ? '#10b981' : '#ef4444', 
                        borderRadius: '4px', 
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        {shelter.available_beds > 0 ? (
                          <>✓ {shelter.available_beds} beds available</>
                        ) : (
                          '✗ Full'
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#666' }}>
                        out of {shelter.total_beds} total
                      </p>
                    </div>
                  </div>

                  {/* Services */}
                  {shelter.services_offered && shelter.services_offered.length > 0 && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Services:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {shelter.services_offered.map(service => (
                          <span 
                            key={service}
                            style={{ 
                              padding: '0.25rem 0.5rem', 
                              backgroundColor: '#eff6ff', 
                              color: '#1e40af', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem'
                            }}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meal Times */}
                  {(shelter.breakfast_time || shelter.lunch_time || shelter.dinner_time) && (
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Meal Times:</p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#666' }}>
                        {shelter.breakfast_time && <span>🌅 {shelter.breakfast_time}</span>}
                        {shelter.lunch_time && <span>☀️ {shelter.lunch_time}</span>}
                        {shelter.dinner_time && <span>🌙 {shelter.dinner_time}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && shelters.length === 0 && filters.lat && (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: '#666' }}>
              No shelters found in your area. Try adjusting your search radius!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShelterSearch;