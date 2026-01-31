/**
 * API Helper Utilities
 * Utility functions for API interaction and error handling
 */

/**
 * Check if error is a persona requirement error
 */
export const isPersonaRequiredError = (error) => {
  return error?.message?.includes('PERSONA_REQUIRED') || 
         error?.message?.includes('No active persona');
};

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message.replace('PERSONA_REQUIRED: ', '');
  return 'An unexpected error occurred';
};

/**
 * Build query string from params object
 */
export const buildQueryString = (params = {}) => {
  const filtered = Object.entries(params).filter(([_, value]) => 
    value !== undefined && value !== null && value !== ''
  );
  
  if (filtered.length === 0) return '';
  
  const queryString = new URLSearchParams(
    filtered.reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {})
  ).toString();
  
  return `?${queryString}`;
};

/**
 * Validate persona
 */
export const VALID_PERSONAS = ['student', 'creator', 'professional', 'entrepreneur', 'researcher'];

export const isValidPersona = (persona) => {
  return VALID_PERSONAS.includes(persona);
};

/**
 * Resource type validation
 * Backend expects: 'url', 'file', 'note'
 */
export const RESOURCE_TYPES = {
  URL: 'url',
  BOOKMARK: 'url', // Alias for backward compatibility
  FILE: 'file',
  DOCUMENT: 'file', // Alias for backward compatibility
  NOTE: 'note',
};

export const isValidResourceType = (type) => {
  return Object.values(RESOURCE_TYPES).includes(type);
};

/**
 * Pagination helpers
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const normalizePagination = (page = 1, limit = DEFAULT_PAGE_SIZE) => ({
  page: Math.max(1, parseInt(page, 10)),
  limit: Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit, 10))),
});

/**
 * Check if response indicates success
 */
export const isSuccessResponse = (response) => {
  return response?.success === true;
};

/**
 * Extract data from API response
 */
export const extractResponseData = (response, defaultValue = null) => {
  return response?.data ?? defaultValue;
};

/**
 * Format resource data for API submission
 */
export const formatResourceData = (resource) => {
  const base = {
    type: resource.type === 'bookmark' ? 'url' : (resource.type || RESOURCE_TYPES.URL),
    title: resource.title?.trim() || 'Untitled',
    description: resource.description?.trim() || '',
    tags: Array.isArray(resource.tags) ? resource.tags : [],
    isFavorite: Boolean(resource.isFavorite),
  };

  // Add type-specific fields
  if ((resource.type === 'bookmark' || resource.type === 'url' || resource.type === RESOURCE_TYPES.URL) && resource.url) {
    base.url = resource.url.trim();
    if (resource.metadata) {
      base.metadata = resource.metadata;
    }
  }

  if (resource.type === RESOURCE_TYPES.NOTE && resource.content) {
    base.content = resource.content.trim();
  }

  // Add folder if specified and not "Uncategorised"
  if (resource.folderId && resource.folderId !== 'uncategorised') {
    base.folderId = resource.folderId;
  }

  return base;
};

/**
 * Format folder data for API submission
 */
export const formatFolderData = (folder) => ({
  name: folder.name?.trim() || 'Untitled Folder',
  description: folder.description?.trim() || '',
  color: folder.color || '#3B82F6',
  icon: folder.icon || 'folder',
  isPrivate: Boolean(folder.isPrivate),
  ...(folder.parentFolder && { parentFolder: folder.parentFolder }),
});

/**
 * Token validation
 */
export const isValidToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // Basic JWT structure check (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Decode JWT payload (without verification - use server for validation)
 * Note: This is a simple base64 decode for React Native
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Simple base64 decode for React Native
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const base64Padded = base64 + padding;
    
    // Use global.atob if available, otherwise skip decode
    if (typeof global.atob === 'function') {
      const jsonPayload = global.atob(base64Padded);
      return JSON.parse(jsonPayload);
    }
    
    // Fallback: return null if decode not available
    console.warn('Base64 decode not available in this environment');
    return null;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};
