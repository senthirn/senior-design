import api from './api';

export const restaurantService = {
  // Get user's restaurant
  getMyRestaurant: () => api.get('/api/restaurants/my'),
  
  // Create restaurant
  createRestaurant: (data) => api.post('/api/restaurants', data),
  
  // Get restaurant meals
  getRestaurantMeals: (restaurantId) => api.get(`/api/meals/restaurant/${restaurantId}`),
  
  // Create meal
  createMeal: (data) => api.post('/api/meals', data),
  
  // Update meal
  updateMeal: (id, data) => api.put(`/api/meals/${id}`, data),
  
  // Delete meal
  deleteMeal: (id) => api.delete(`/api/meals/${id}`),
};

export default restaurantService;