import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'individual',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/'); // Redirect to home after registration
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <div style={{ maxWidth: '500px', width: '100%', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: '#667eea' }}>
          🍽️ MealMatch
        </h2>
        
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
          Create Account
        </h3>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              I am a:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
            >
              <option value="individual">Individual (Looking for meals)</option>
              <option value="restaurant">Restaurant (Offering meals)</option>
              <option value="shelter">Shelter (Providing services)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              placeholder="••••••••"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              placeholder="••••••••"
            />
          </div>

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
              fontSize: '1rem', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
