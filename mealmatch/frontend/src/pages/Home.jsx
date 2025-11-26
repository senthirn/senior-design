import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
            🍽️ MealMatch
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                Welcome, {user.firstName || user.email}!
              </span>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                backgroundColor: '#667eea20', 
                color: '#667eea', 
                borderRadius: '12px', 
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {user.role}
              </span>
              {user.role === 'restaurant' && (
                <button
                  onClick={() => navigate('/restaurant/dashboard')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#10b981', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Dashboard
                </button>
              )}
              {user.role === 'shelter' && (
                <button
                  onClick={() => navigate('/shelter/dashboard')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#f59e0b', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Dashboard
                </button>
              )}
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
            </>
          ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: 'transparent', 
                    color: '#667eea', 
                    border: '1px solid #667eea', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
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
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Find Affordable Meals & Support
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Connecting individuals with free meals, restaurant deals, and shelter services in your community.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          
          {/* Free Meals - CLICKABLE */}
          <div 
            onClick={() => navigate('/search')}
            style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
              Free Meals
            </h3>
            <p style={{ color: '#666' }}>
              Discover restaurants and organizations offering free meals in your area.
            </p>
          </div>

          {/* Restaurant Deals - CLICKABLE */}
          <div 
            onClick={() => navigate('/search')}
            style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
              Restaurant Deals
            </h3>
            <p style={{ color: '#666' }}>
              Find amazing discounts and promotions at local restaurants.
            </p>
          </div>

          {/* Shelter Services - CLICKABLE */}
          <div 
            onClick={() => navigate('/shelters')}
            style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
              Shelter Services
            </h3>
            <p style={{ color: '#666' }}>
              Connect with shelters providing meals, housing, and support services.
            </p>
          </div>

        </div>

        {!user && (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button
              onClick={() => navigate('/register')}
              style={{ 
                padding: '1rem 2rem', 
                backgroundColor: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
              }}
            >
              Get Started →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
