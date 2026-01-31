/**
 * Tags API
 * Handles tag management and categorization
 */
import apiService from './api';

export const tagsAPI = {
  /**
   * Get all tags
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tags data
   */
  getAll: async (params = {}) => {
    const response = await apiService.getTags(params);
    return response;
  },

  /**
   * Get tag by ID
   * @param {string} id - Tag ID
   * @returns {Promise<Object>} Tag data
   */
  getById: async (id) => {
    const response = await apiService.getTagById(id);
    return response;
  },

  /**
   * Create new tag
   * @param {Object} data - Tag data { name, color }
   * @returns {Promise<Object>} Created tag
   */
  create: async (data) => {
    const response = await apiService.createTag(data);
    return response;
  },

  /**
   * Update tag
   * @param {string} id - Tag ID
   * @param {Object} data - Updated tag data
   * @returns {Promise<Object>} Updated tag
   */
  update: async (id, data) => {
    const response = await apiService.updateTag(id, data);
    return response;
  },

  /**
   * Delete tag
   * @param {string} id - Tag ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    const response = await apiService.deleteTag(id);
    return response;
  },

  /**
   * Get popular tags
   * @param {number} limit - Number of tags to return
   * @returns {Promise<Object>} Popular tags
   */
  getPopular: async (limit = 10) => {
    const response = await apiService.getPopularTags(limit);
    return response;
  },
};

export default tagsAPI;
