/**
 * Folders API
 * Handles folder organization and management
 */
import apiService from './api';

export const foldersAPI = {
  /**
   * Get all folders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Folders data
   */
  getAll: async (params = {}) => {
    const response = await apiService.getFolders(params);
    return response;
  },

  /**
   * Get folder by ID
   * @param {string} id - Folder ID
   * @returns {Promise<Object>} Folder data
   */
  getById: async (id) => {
    const response = await apiService.getFolderById(id);
    return response;
  },

  /**
   * Create new folder
   * @param {Object} data - Folder data { name, description, color, icon, isPrivate }
   * @returns {Promise<Object>} Created folder
   */
  create: async (data) => {
    const response = await apiService.createFolder(data);
    return response;
  },

  /**
   * Update folder
   * @param {string} id - Folder ID
   * @param {Object} data - Updated folder data
   * @returns {Promise<Object>} Updated folder
   */
  update: async (id, data) => {
    const response = await apiService.updateFolder(id, data);
    return response;
  },

  /**
   * Delete folder
   * @param {string} id - Folder ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    const response = await apiService.deleteFolder(id);
    return response;
  },

  /**
   * Get resources in a folder
   * @param {string} id - Folder ID
   * @returns {Promise<Object>} Resources in folder
   */
  getResources: async (id) => {
    const response = await apiService.getFolderResources(id);
    return response;
  },
};

export default foldersAPI;
