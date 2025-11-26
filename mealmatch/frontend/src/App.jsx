import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MealSearch from './pages/MealSearch';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantSetup from './pages/RestaurantSetup';
import ShelterSetup from './pages/ShelterSetup';
import ShelterDashboard from './pages/ShelterDashboard';
import ShelterSearch from './pages/ShelterSearch';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/search" element={<MealSearch />} />
          <Route 
            path="/restaurant/dashboard" 
            element={
              <ProtectedRoute>
                <RestaurantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurant/setup" 
            element={
              <ProtectedRoute>
                <RestaurantSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shelter/setup" 
            element={
              <ProtectedRoute>
                <ShelterSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shelter/dashboard" 
            element={
              <ProtectedRoute>
                <ShelterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/shelters" element={<ShelterSearch />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Add protected routes here later */}
          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;