// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api-gateway-keeplynk-1.onrender.com',
  API_PREFIX: '/api',
  TIMEOUT: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    ADD_PERSONA: '/auth/personas',
    SWITCH_PERSONA: '/auth/personas/switch',
    REMOVE_PERSONA: '/auth/personas',
  },
  
  // Resources
  RESOURCES: {
    BASE: '/resources',
    SEARCH: '/resources/search',
    UPLOAD: '/resources/upload',
    UNORGANIZED: '/resources/unorganized',
    BY_ID: (id) => `/resources/${id}`,
  },
  
  // Folders
  FOLDERS: {
    BASE: '/folders',
    BY_ID: (id) => `/folders/${id}`,
    RESOURCES: (id) => `/folders/${id}/resources`,
  },
  
  // Tags
  TAGS: {
    BASE: '/tags',
    POPULAR: '/tags/popular',
    BY_ID: (id) => `/tags/${id}`,
  },
  
  // Agent
  AGENT: {
    ORGANIZE: '/organize',
    DECIDE: '/agent/decide',
  },
};

// Build full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};
