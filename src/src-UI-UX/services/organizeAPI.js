/**
 * Organize API
 * AI-powered organization and categorization
 */
import apiService from './api';

export const organizeAPI = {
  /**
   * Organize a resource using AI
   * @param {string} resourceId - Resource ID to organize
   * @param {string|null} targetFolderId - Optional target folder ID
   * @returns {Promise<Object>} Organization result
   */
  organizeResource: async (resourceId, targetFolderId = null) => {
    const response = await apiService.organizeResource(resourceId, targetFolderId);
    return response;
  },

  /**
   * Get AI suggestions for resource categorization
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Object>} AI suggestions
   */
  getSuggestions: async (resourceId) => {
    const response = await apiService.agentDecide(
      { resourceId },
      'categorize',
      { resourceId }
    );
    return response;
  },

  /**
   * Analyze resource content
   * @param {Object} data - Resource data { url, title, content }
   * @returns {Promise<Object>} Analysis result
   */
  analyzeResource: async (data) => {
    const response = await apiService.agentDecide(
      { task: 'analyze' },
      'analyze',
      data
    );
    return response;
  },
};

export default organizeAPI;
