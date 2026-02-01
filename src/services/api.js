
import { API_ENDPOINTS } from '../config/api';
import { formatResourceData, formatFolderData } from './utils/apiHelpers';
import { apiClient, ApiTokenManager } from './api/axios';

class ApiService {
  // Authentication
  async register(userData) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    if (response.data?.token) {
      ApiTokenManager.setToken(response.data.token);
    }
    return response.data;
  }

  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data?.token) {
      ApiTokenManager.setToken(response.data.token);
    }
    return response.data;
  }

  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }

  async addPersona(persona) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.ADD_PERSONA, { persona });
    if (response.data?.token) {
      ApiTokenManager.setToken(response.data.token);
    }
    return response.data;
  }

  async switchPersona(persona) {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.SWITCH_PERSONA, { persona });
    if (response.data?.token) {
      ApiTokenManager.setToken(response.data.token);
    }
    return response.data;
  }

  async removePersona(persona) {
    const endpoint = `${API_ENDPOINTS.AUTH.REMOVE_PERSONA}/${persona}`;
    const response = await apiClient.delete(endpoint);
    return response.data;
  }

  // Resources
  async getResources(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.RESOURCES.BASE, { params });
    return response.data;
  }

  async getResourceById(id) {
    const response = await apiClient.get(API_ENDPOINTS.RESOURCES.BY_ID(id));
    return response.data;
  }

  async createResource(resourceData) {
    const formattedData = formatResourceData(resourceData);
    const response = await apiClient.post(API_ENDPOINTS.RESOURCES.BASE, formattedData);
    return response.data;
  }

  async updateResource(id, resourceData) {
    const response = await apiClient.put(API_ENDPOINTS.RESOURCES.BY_ID(id), resourceData);
    return response.data;
  }

  async deleteResource(id) {
    const response = await apiClient.delete(API_ENDPOINTS.RESOURCES.BY_ID(id));
    return response.data;
  }

  async searchResources(query, params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.RESOURCES.SEARCH, {
      params: { q: query, ...params },
    });
    return response.data;
  }

  async getUnorganizedResources() {
    const response = await apiClient.get(API_ENDPOINTS.RESOURCES.UNORGANIZED);
    return response.data;
  }

  // Folders
  async getFolders() {
    const response = await apiClient.get(API_ENDPOINTS.FOLDERS.BASE);
    return response.data;
  }

  async getFolderById(id) {
    const response = await apiClient.get(API_ENDPOINTS.FOLDERS.BY_ID(id));
    return response.data;
  }

  async getFolderResources(id) {
    const response = await apiClient.get(API_ENDPOINTS.FOLDERS.RESOURCES(id));
    return response.data;
  }

  async createFolder(folderData) {
    const formattedData = formatFolderData(folderData);
    const response = await apiClient.post(API_ENDPOINTS.FOLDERS.BASE, formattedData);
    return response.data;
  }

  async updateFolder(id, folderData) {
    const response = await apiClient.put(API_ENDPOINTS.FOLDERS.BY_ID(id), folderData);
    return response.data;
  }

  async deleteFolder(id) {
    const response = await apiClient.delete(API_ENDPOINTS.FOLDERS.BY_ID(id));
    return response.data;
  }

  // Tags
  async getTags() {
    const response = await apiClient.get(API_ENDPOINTS.TAGS.BASE);
    return response.data;
  }

  async getTagById(id) {
    const response = await apiClient.get(API_ENDPOINTS.TAGS.BY_ID(id));
    return response.data;
  }

  async getPopularTags(limit = 10) {
    const response = await apiClient.get(API_ENDPOINTS.TAGS.POPULAR, { params: { limit } });
    return response.data;
  }

  async createTag(tagData) {
    const response = await apiClient.post(API_ENDPOINTS.TAGS.BASE, tagData);
    return response.data;
  }

  async updateTag(id, tagData) {
    const response = await apiClient.put(API_ENDPOINTS.TAGS.BY_ID(id), tagData);
    return response.data;
  }

  async deleteTag(id) {
    const response = await apiClient.delete(API_ENDPOINTS.TAGS.BY_ID(id));
    return response.data;
  }

  // Agent
  async agentDecide(context, action, data) {
    const response = await apiClient.post(API_ENDPOINTS.AGENT.DECIDE, { context, action, data });
    return response.data;
  }

  async organizeResource(resourceId, targetFolderId = null) {
    const response = await apiClient.post(API_ENDPOINTS.AGENT.ORGANIZE, { resourceId, targetFolderId });
    return response.data;
  }
}

export default new ApiService();
