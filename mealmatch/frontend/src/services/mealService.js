import api from './api';

export const mealService = {
  // Search meals with filters
  searchMeals: (params) => {
    return api.get('/api/meals', { params });
  },

  // Get meal by ID
  getMealById: (id) => {
    return api.get(`/api/meals/${id}`);
  },
};

export default mealService;