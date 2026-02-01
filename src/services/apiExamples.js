// Example usage of API service
// NOTE: These are code examples. In React components, use the hooks directly.
// In non-React code (like services), use the store directly or pass dispatch as a parameter.

import apiService from '../services/api'; // No axiosConfig import here, nothing to change
import { store } from '../app/store';
import { register, login, logout, addPersona, switchPersona } from '../features/auth/authThunk';

// ============================================
// Authentication Examples
// ============================================

// 1. Register a new user
// In a React component, use: const { register } = useAuth();
export const registerExample = async () => {
  const result = await store.dispatch(register({
    email: 'user@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    initialPersona: 'student', // Optional but recommended
  }));

  if (result.meta.requestStatus === 'fulfilled') {
    console.log('User registered:', result.payload.user);
    console.log('Token:', result.payload.token);
  } else {
    console.error('Registration failed:', result.payload);
  }
};

// 2. Login
// In a React component, use: const { login } = useAuth();
export const loginExample = async () => {
  const result = await store.dispatch(login({
    email: 'user@example.com',
    password: 'SecurePass123!',
  }));

  if (result.meta.requestStatus === 'fulfilled') {
    console.log('User logged in:', result.payload.user);
  }
};

// 3. Logout
// In a React component, use: const { logout } = useAuth();
export const logoutExample = async () => {
  await store.dispatch(logout());
  console.log('User logged out');
};

// ============================================
// Resources (Bookmarks) Examples
// ============================================

// 4. Get all resources
export const getResourcesExample = async () => {
  try {
    const response = await apiService.getResources({
      page: 1,
      limit: 20,
      folderId: 'optional-folder-id',
      isFavorite: false,
    });

    if (response.success) {
      console.log('Resources:', response.data);
      console.log('Pagination:', response.pagination);
    }
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
};

// 5. Create a bookmark
export const createBookmarkExample = async () => {
  try {
    const response = await apiService.createResource({
      type: 'bookmark',
      url: 'https://example.com/article',
      title: 'Interesting Article',
      description: 'An article about web development',
      tags: ['javascript', 'tutorial'],
      folderId: 'optional-folder-id', // Omit for "Uncategorized"
      isFavorite: false,
      metadata: {
        imageUrl: 'https://example.com/image.jpg',
        domain: 'example.com',
      },
    });

    if (response.success) {
      console.log('Bookmark created:', response.data);
    }
  } catch (error) {
    console.error('Error creating bookmark:', error);
  }
};

// 6. Create a note
export const createNoteExample = async () => {
  try {
    const response = await apiService.createResource({
      type: 'note',
      title: 'My Study Notes',
      description: 'Notes about JavaScript closures',
      content: 'Detailed notes content here...',
      tags: ['javascript', 'notes'],
      folderId: 'optional-folder-id',
      isFavorite: false,
    });

    if (response.success) {
      console.log('Note created:', response.data);
    }
  } catch (error) {
    console.error('Error creating note:', error);
  }
};

// 7. Search resources
export const searchResourcesExample = async () => {
  try {
    const response = await apiService.searchResources('javascript', {
      page: 1,
      limit: 10,
    });

    if (response.success) {
      console.log('Search results:', response.data);
    }
  } catch (error) {
    console.error('Error searching:', error);
  }
};

// 8. Update a resource
export const updateResourceExample = async (resourceId) => {
  try {
    const response = await apiService.updateResource(resourceId, {
      title: 'Updated Title',
      description: 'Updated description',
      tags: ['javascript', 'web-dev', 'tutorial'],
      isFavorite: true,
    });

    if (response.success) {
      console.log('Resource updated:', response.data);
    }
  } catch (error) {
    console.error('Error updating resource:', error);
  }
};

// 9. Delete a resource
export const deleteResourceExample = async (resourceId) => {
  try {
    await apiService.deleteResource(resourceId);
    console.log('Resource deleted');
  } catch (error) {
    console.error('Error deleting resource:', error);
  }
};

// ============================================
// Folders Examples
// ============================================

// 10. Get all folders
export const getFoldersExample = async () => {
  try {
    const response = await apiService.getFolders();

    if (response.success) {
      console.log('Folders:', response.data);
    }
  } catch (error) {
    console.error('Error fetching folders:', error);
  }
};

// 11. Create a folder
export const createFolderExample = async () => {
  try {
    const response = await apiService.createFolder({
      name: 'Web Development',
      description: 'Resources for web development',
      color: '#3B82F6',
      icon: 'folder',
      isPrivate: false,
    });

    if (response.success) {
      console.log('Folder created:', response.data);
    }
  } catch (error) {
    console.error('Error creating folder:', error);
  }
};

// 12. Update a folder
export const updateFolderExample = async (folderId) => {
  try {
    const response = await apiService.updateFolder(folderId, {
      name: 'Updated Folder Name',
      description: 'Updated description',
      color: '#10B981',
    });

    if (response.success) {
      console.log('Folder updated:', response.data);
    }
  } catch (error) {
    console.error('Error updating folder:', error);
  }
};

// 13. Delete a folder
export const deleteFolderExample = async (folderId) => {
  try {
    await apiService.deleteFolder(folderId);
    console.log('Folder deleted');
  } catch (error) {
    console.error('Error deleting folder:', error);
  }
};

// ============================================
// Tags Examples
// ============================================

// 14. Get all tags
export const getTagsExample = async () => {
  try {
    const response = await apiService.getTags();

    if (response.success) {
      console.log('Tags:', response.data);
    }
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
};

// 15. Get popular tags
export const getPopularTagsExample = async () => {
  try {
    const response = await apiService.getPopularTags(5);

    if (response.success) {
      console.log('Popular tags:', response.data);
    }
  } catch (error) {
    console.error('Error fetching popular tags:', error);
  }
};

// 16. Create a tag
export const createTagExample = async () => {
  try {
    const response = await apiService.createTag({
      name: 'JavaScript',
      color: '#F7DF1E',
    });

    if (response.success) {
      console.log('Tag created:', response.data);
    }
  } catch (error) {
    console.error('Error creating tag:', error);
  }
};

// ============================================
// Persona Examples
// ============================================

// 17. Add a persona
// In a React component, use: const { addPersona } = useAuth();
export const addPersonaExample = async () => {
  const result = await store.dispatch(addPersona('professional'));

  if (result.meta.requestStatus === 'fulfilled') {
    console.log('Persona added:', result.payload);
  }
};

// 18. Switch persona
// In a React component, use: const { switchPersona } = useAuth();
export const switchPersonaExample = async () => {
  const result = await store.dispatch(switchPersona('professional'));

  if (result.meta.requestStatus === 'fulfilled') {
    console.log('Switched to:', result.payload.currentPersona);
  }
};

// ============================================
// Agent Examples
// ============================================

// 19. Use agent for smart categorization
export const agentCategorizeExample = async () => {
  try {
    const response = await apiService.agentDecide(
      {
        userId: 'user-id',
        persona: 'student',
        currentTask: 'bookmark management',
      },
      'categorize',
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        title: 'JavaScript | MDN',
      }
    );

    console.log('Agent suggestions:', response.suggestions);
    console.log('Agent actions:', response.actions);
  } catch (error) {
    console.error('Agent error:', error);
  }
};
