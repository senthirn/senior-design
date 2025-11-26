import api from './api';

export const shelterService = {
  // Get user's shelter
  getMyShelter: () => api.get('/api/shelters/my'),
  
  // Create shelter
  createShelter: (data) => api.post('/api/shelters', data),
  
  // Update shelter
  updateShelter: (id, data) => api.put(`/api/shelters/${id}`, data),
  
  // Update availability
  updateAvailability: (id, data) => api.put(`/api/shelters/${id}/availability`, data),
  
  // Delete shelter
  deleteShelter: (id) => api.delete(`/api/shelters/${id}`),
};

export default shelterService;