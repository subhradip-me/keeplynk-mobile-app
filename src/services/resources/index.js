/**
 * Resources API
 * Handles bookmarks, documents, and notes
 */
import apiService from '../api';

export const resourcesAPI = {
  getAll: async (params = {}) => {
    const response = await apiService.getResources(params);
    return response;
  },
  getById: async (id) => {
    const response = await apiService.getResourceById(id);
    return response;
  },
  create: async (data) => {
    const response = await apiService.createResource(data);
    return response;
  },
  update: async (id, data) => {
    const response = await apiService.updateResource(id, data);
    return response;
  },
  delete: async (id) => {
    const response = await apiService.deleteResource(id);
    return response;
  },
  getUnorganized: async () => {
    const response = await apiService.getUnorganizedResources();
    return response;
  },
  search: async (query, params = {}) => {
    const response = await apiService.searchResources(query, params);
    return response;
  },
};

export default resourcesAPI;
