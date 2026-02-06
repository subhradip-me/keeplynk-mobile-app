/**
 * Organize API
 * AI-powered organization and categorization
 */
import apiService from '../api';

export const organizeAPI = {
  organizeResource: async (resourceId, targetFolderId = null) => {
    const response = await apiService.organizeResource(resourceId, targetFolderId);
    return response;
  },
  getSuggestions: async (resourceId) => {
    const response = await apiService.agentDecide(
      { resourceId },
      'categorize',
      { resourceId }
    );
    return response;
  },
  analyzeResource: async (data) => {
    const response = await apiService.agentDecide(
      { task: 'analyze' },
      'analyze',
      data
    );
    return response;
  },
  autoOrganize: async (limit = 50) => {
    const response = await apiService.autoOrganize(limit);
    return response;
  },
};

export default organizeAPI;
