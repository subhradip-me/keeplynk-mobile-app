/**
 * Folders API
 * Handles folder organization and management
 */
import apiService from '../api';

export const foldersAPI = {
  getAll: async (params = {}) => {
    const response = await apiService.getFolders(params);
    return response;
  },
  getById: async (id) => {
    const response = await apiService.getFolderById(id);
    return response;
  },
  create: async (data) => {
    const response = await apiService.createFolder(data);
    return response;
  },
  update: async (id, data) => {
    const response = await apiService.updateFolder(id, data);
    return response;
  },
  delete: async (id) => {
    const response = await apiService.deleteFolder(id);
    return response;
  },
  getResources: async (id) => {
    const response = await apiService.getFolderResources(id);
    return response;
  },
};

export default foldersAPI;
