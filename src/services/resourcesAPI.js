/**
 * Resources API
 * Handles bookmarks, documents, and notes
 */
import apiService from './api';

export const resourcesAPI = {
  /**
   * Get all resources
   * @param {Object} params - Query parameters { page, limit, folderId, isFavorite, etc. }
   * @returns {Promise<Object>} Resources data
   */
  getAll: async (params = {}) => {
    const response = await apiService.getResources(params);
    return response;
  },

  /**
   * Get resource by ID
   * @param {string} id - Resource ID
   * @returns {Promise<Object>} Resource data
   */
  getById: async (id) => {
    const response = await apiService.getResourceById(id);
    return response;
  },

  /**
   * Create new resource
   * @param {Object} data - Resource data { type, url, title, description, tags, folderId, etc. }
   * @returns {Promise<Object>} Created resource
   */
  create: async (data) => {
    const response = await apiService.createResource(data);
    return response;
  },

  /**
   * Update resource
   * @param {string} id - Resource ID
   * @param {Object} data - Updated resource data
   * @returns {Promise<Object>} Updated resource
   */
  update: async (id, data) => {
    const response = await apiService.updateResource(id, data);
    return response;
  },

  /**
   * Delete resource
   * @param {string} id - Resource ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    const response = await apiService.deleteResource(id);
    return response;
  },

  /**
   * Get unorganized resources
   * Resources without a folder or in "Uncategorised"
   * @returns {Promise<Object>} Unorganized resources
   */
  getUnorganized: async () => {
    const response = await apiService.getUnorganizedResources();
    return response;
  },

  /**
   * Search resources
   * @param {string} query - Search query
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} Search results
   */
  search: async (query, params = {}) => {
    const response = await apiService.searchResources(query, params);
    return response;
  },
};

export default resourcesAPI;
