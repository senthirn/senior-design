import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { shelterService } from '../services/shelterService';

const ShelterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableBeds, setAvailableBeds] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user?.role !== 'shelter') {
      navigate('/');
      return;
    }
    loadShelterData();
  }, [user]);

  const loadShelterData = async () => {
    try {
      const response = await shelterService.getMyShelter();
      setShelter(response.data.shelter);
      setAvailableBeds(response.data.shelter.available_beds);
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/shelter/setup');
        return;
      }
      setError('Failed to load shelter data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    try {
      await shelterService.updateAvailability(shelter.id, { availableBeds: parseInt(availableBeds) });
      await loadShelterData();
      alert('Availability updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update availability');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteShelter = async () => {
    if (!window.confirm('Are you sure you want to delete your shelter? This action cannot be undone.')) {
      return;
    }
  
    try {
      await shelterService.deleteShelter(shelter.id);
      alert('Shelter deleted successfully');
      navigate('/shelter/setup');
    } catch (err) {
      setError('Failed to delete shelter');
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

  const occupancyRate = shelter ? ((shelter.total_beds - shelter.available_beds) / shelter.total_beds * 100).toFixed(0) : 0;

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
            Shelter Dashboard
          </h2>
          <p style={{ color: '#666' }}>Manage your shelter availability and services</p>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
            {error}
          </div>
        )}

        {/* Shelter Info Card */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            {shelter?.name}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Address</p>
              <p style={{ fontWeight: '500' }}>{shelter?.address}</p>
              <p style={{ fontSize: '0.875rem' }}>{shelter?.city}, {shelter?.state} {shelter?.zip_code}</p>
            </div>
            
            <div>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Phone</p>
              <p style={{ fontWeight: '500' }}>{shelter?.phone}</p>
            </div>

            <div>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Total Capacity</p>
              <p style={{ fontWeight: '500', fontSize: '1.5rem' }}>{shelter?.total_beds} beds</p>
            </div>
          </div>

          {/* Services */}
          {shelter?.services_offered && shelter.services_offered.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Services Offered:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {shelter.services_offered.map(service => (
                  <span 
                    key={service}
                    style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: '#eff6ff', 
                      color: '#1e40af', 
                      borderRadius: '12px', 
                      fontSize: '0.875rem'
                    }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meal Times */}
          {(shelter?.breakfast_time || shelter?.lunch_time || shelter?.dinner_time) && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Meal Times:</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                {shelter?.breakfast_time && <span>🌅 Breakfast: {shelter.breakfast_time}</span>}
                {shelter?.lunch_time && <span>☀️ Lunch: {shelter.lunch_time}</span>}
                {shelter?.dinner_time && <span>🌙 Dinner: {shelter.dinner_time}</span>}
              </div>
            </div>
          )}

          {/* Delete Button */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <button
                onClick={handleDeleteShelter}
                style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
                }}
            >
                🗑️ Delete Shelter
            </button>
            </div>
        </div>

        {/* Availability Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Available Beds</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {shelter?.available_beds}
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Occupied Beds</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {shelter?.total_beds - shelter?.available_beds}
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Occupancy Rate</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
              {occupancyRate}%
            </p>
          </div>
        </div>

        {/* Update Availability */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Update Bed Availability
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
            Keep your availability up to date so people can find shelter when they need it.
          </p>

          <form onSubmit={handleUpdateAvailability} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Available Beds (out of {shelter?.total_beds})
              </label>
              <input
                type="number"
                min="0"
                max={shelter?.total_beds}
                value={availableBeds}
                onChange={(e) => setAvailableBeds(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              style={{ 
                padding: '0.75rem 2rem', 
                backgroundColor: updating ? '#ccc' : '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: updating ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
          </form>

          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '4px' }}>
            <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
              💡 <strong>Tip:</strong> Update your availability regularly, especially at the end of the day, so people can find accurate information about where to stay.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShelterDashboard;