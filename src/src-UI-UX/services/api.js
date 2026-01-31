import { getApiUrl, API_ENDPOINTS } from '../config/api';
import { formatResourceData, formatFolderData } from '../utils/apiHelpers';

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400 && data.message?.includes('No active persona')) {
          throw new Error('PERSONA_REQUIRED: ' + (data.message || 'Please add a persona to your account'));
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    const response = await this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getProfile() {
    return this.request(API_ENDPOINTS.AUTH.ME);
  }

  async addPersona(persona) {
    const response = await this.request(API_ENDPOINTS.AUTH.ADD_PERSONA, {
      method: 'POST',
      body: JSON.stringify({ persona }),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async switchPersona(persona) {
    const response = await this.request(API_ENDPOINTS.AUTH.SWITCH_PERSONA, {
      method: 'PUT',
      body: JSON.stringify({ persona }),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async removePersona(persona) {
    return this.request(`${API_ENDPOINTS.AUTH.REMOVE_PERSONA}/${persona}`, {
      method: 'DELETE',
    });
  }

  // Resources
  async getResources(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.RESOURCES.BASE}?${queryString}`
      : API_ENDPOINTS.RESOURCES.BASE;
    
    return this.request(endpoint);
  }

  async getResourceById(id) {
    return this.request(API_ENDPOINTS.RESOURCES.BY_ID(id));
  }

  async createResource(resourceData) {
    const formattedData = formatResourceData(resourceData);
    return this.request(API_ENDPOINTS.RESOURCES.BASE, {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async updateResource(id, resourceData) {
    return this.request(API_ENDPOINTS.RESOURCES.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    });
  }

  async deleteResource(id) {
    return this.request(API_ENDPOINTS.RESOURCES.BY_ID(id), {
      method: 'DELETE',
    });
  }

  async searchResources(query, params = {}) {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    return this.request(`${API_ENDPOINTS.RESOURCES.SEARCH}?${queryString}`);
  }

  async getUnorganizedResources() {
    return this.request(API_ENDPOINTS.RESOURCES.UNORGANIZED);
  }

  // Folders
  async getFolders() {
    return this.request(API_ENDPOINTS.FOLDERS.BASE);
  }

  async getFolderById(id) {
    return this.request(API_ENDPOINTS.FOLDERS.BY_ID(id));
  }

  async getFolderResources(id) {
    return this.request(API_ENDPOINTS.FOLDERS.RESOURCES(id));
  }

  async createFolder(folderData) {
    const formattedData = formatFolderData(folderData);
    return this.request(API_ENDPOINTS.FOLDERS.BASE, {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async updateFolder(id, folderData) {
    return this.request(API_ENDPOINTS.FOLDERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(folderData),
    });
  }

  async deleteFolder(id) {
    return this.request(API_ENDPOINTS.FOLDERS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Tags
  async getTags() {
    return this.request(API_ENDPOINTS.TAGS.BASE);
  }

  async getTagById(id) {
    return this.request(API_ENDPOINTS.TAGS.BY_ID(id));
  }

  async getPopularTags(limit = 10) {
    return this.request(`${API_ENDPOINTS.TAGS.POPULAR}?limit=${limit}`);
  }

  async createTag(tagData) {
    return this.request(API_ENDPOINTS.TAGS.BASE, {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  }

  async updateTag(id, tagData) {
    return this.request(API_ENDPOINTS.TAGS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(tagData),
    });
  }

  async deleteTag(id) {
    return this.request(API_ENDPOINTS.TAGS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Agent
  async agentDecide(context, action, data) {
    return this.request(API_ENDPOINTS.AGENT.DECIDE, {
      method: 'POST',
      body: JSON.stringify({ context, action, data }),
    });
  }

  async organizeResource(resourceId, targetFolderId = null) {
    return this.request(API_ENDPOINTS.AGENT.ORGANIZE, {
      method: 'POST',
      body: JSON.stringify({ resourceId, targetFolderId }),
    });
  }
}

export default new ApiService();
