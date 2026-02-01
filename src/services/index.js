/**
 * Central API Export
 * React Native version of API client
 * 
 * Usage:
 * import { authAPI, resourcesAPI, foldersAPI, tagsAPI, organizeAPI } from './services';
 * 
 * // Or import specific functions
 * import { Login, Register } from './services';
 */

// Core API client
export { default as apiClient } from './api';
export { default as apiService } from './api';

// API modules
export { authAPI } from './auth';
export { default as resourcesAPI } from './resources';
export { default as foldersAPI } from './folders';
export { default as tagsAPI } from './tags';
export { default as organizeAPI } from './organize';

// Legacy exports for backward compatibility with web app
import { authAPI as authAPIImport } from './auth';

export { authAPI as Auth } from './auth';
export const Login = authAPIImport.login;
export const Register = authAPIImport.register;
export const Logout = authAPIImport.logout;

/**
 * Example Usage:
 * 
 * // Using module API
 * import { authAPI } from './services';
 * const user = await authAPI.login({ email, password });
 * 
 * // Using legacy exports
 * import { Login } from './services';
 * const user = await Login({ email, password });
 * 
 * // Using resources
 * import { resourcesAPI } from './services';
 * const resources = await resourcesAPI.getAll({ page: 1, limit: 20 });
 * const resource = await resourcesAPI.create({ type: 'url', url: '...' });
 * 
 * // Using folders
 * import { foldersAPI } from './services';
 * const folders = await foldersAPI.getAll();
 * const folder = await foldersAPI.create({ name: 'My Folder' });
 * 
 * // Using tags
 * import { tagsAPI } from './services';
 * const tags = await tagsAPI.getAll();
 * const popularTags = await tagsAPI.getPopular(5);
 * 
 * // Using AI organization
 * import { organizeAPI } from './services';
 * await organizeAPI.organizeResource(resourceId);
 */
