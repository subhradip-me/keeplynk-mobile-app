/**
 * Tags API
 * Handles tag management and categorization
 */
import apiService from '../api';

export const tagsAPI = {
  getAll: async (params = {}) => {
    const response = await apiService.getTags(params);
    return response;
  },
  getById: async (id) => {
    const response = await apiService.getTagById(id);
    return response;
  },
  create: async (data) => {
    const response = await apiService.createTag(data);
    return response;
  },
  update: async (id, data) => {
    const response = await apiService.updateTag(id, data);
    return response;
  },
  delete: async (id) => {
    const response = await apiService.deleteTag(id);
    return response;
  },
  getPopular: async (limit = 10) => {
    const response = await apiService.getPopularTags(limit);
    return response;
  },
};

export default tagsAPI;
