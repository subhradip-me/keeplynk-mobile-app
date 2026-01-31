/**
 * API Testing Utilities
 * Helper functions for testing API endpoints during development
 */

import apiService from '../services/api';

/**
 * Test Authentication Flow
 */
export const testAuthFlow = async () => {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // 1. Register
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      email: `test${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      initialPersona: 'student',
    };
    
    const registerResult = await apiService.register(registerData);
    console.log('✅ Registration successful:', registerResult.data.user);
    console.log('📝 Token received:', registerResult.data.token.substring(0, 20) + '...\n');

    // 2. Get Profile
    console.log('2️⃣ Testing Get Profile...');
    const profileResult = await apiService.getProfile();
    console.log('✅ Profile retrieved:', profileResult.data.user);
    console.log('👤 Current persona:', profileResult.data.user.currentPersona, '\n');

    // 3. Add Persona
    console.log('3️⃣ Testing Add Persona...');
    const addPersonaResult = await apiService.addPersona('professional');
    console.log('✅ Persona added:', addPersonaResult.data);
    console.log('📝 New token received:', addPersonaResult.data.token.substring(0, 20) + '...\n');

    // 4. Switch Persona
    console.log('4️⃣ Testing Switch Persona...');
    const switchResult = await apiService.switchPersona('student');
    console.log('✅ Persona switched:', switchResult.data);
    console.log('👤 Current persona:', switchResult.data.currentPersona, '\n');

    return { success: true, message: 'All auth tests passed!' };
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test Resources Flow
 */
export const testResourcesFlow = async () => {
  console.log('🧪 Testing Resources Flow...\n');

  try {
    // 1. Create Resource
    console.log('1️⃣ Testing Create Resource...');
    const resourceData = {
      type: 'url',
      url: 'https://example.com/test',
      title: 'Test Bookmark',
      description: 'A test bookmark',
      tags: ['test', 'example'],
      isFavorite: true,
    };
    
    const createResult = await apiService.createResource(resourceData);
    console.log('✅ Resource created:', createResult.data);
    const resourceId = createResult.data._id;
    console.log('🆔 Resource ID:', resourceId, '\n');

    // 2. Get All Resources
    console.log('2️⃣ Testing Get All Resources...');
    const getAllResult = await apiService.getResources();
    console.log('✅ Resources retrieved:', getAllResult.data.length, 'items\n');

    // 3. Get Resource by ID
    console.log('3️⃣ Testing Get Resource by ID...');
    const getByIdResult = await apiService.getResourceById(resourceId);
    console.log('✅ Resource retrieved:', getByIdResult.data.title, '\n');

    // 4. Update Resource
    console.log('4️⃣ Testing Update Resource...');
    const updateResult = await apiService.updateResource(resourceId, {
      title: 'Updated Test Bookmark',
      isFavorite: false,
    });
    console.log('✅ Resource updated:', updateResult.data.title, '\n');

    // 5. Search Resources
    console.log('5️⃣ Testing Search Resources...');
    const searchResult = await apiService.searchResources('test');
    console.log('✅ Search results:', searchResult.data.length, 'items\n');

    // 6. Delete Resource
    console.log('6️⃣ Testing Delete Resource...');
    await apiService.deleteResource(resourceId);
    console.log('✅ Resource deleted\n');

    return { success: true, message: 'All resource tests passed!' };
  } catch (error) {
    console.error('❌ Resource test failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test Folders Flow
 */
export const testFoldersFlow = async () => {
  console.log('🧪 Testing Folders Flow...\n');

  try {
    // 1. Create Folder
    console.log('1️⃣ Testing Create Folder...');
    const folderData = {
      name: 'Test Folder',
      description: 'A test folder',
      color: '#3B82F6',
      icon: 'folder',
      isPrivate: false,
    };
    
    const createResult = await apiService.createFolder(folderData);
    console.log('✅ Folder created:', createResult.data);
    const folderId = createResult.data._id;
    console.log('🆔 Folder ID:', folderId, '\n');

    // 2. Get All Folders
    console.log('2️⃣ Testing Get All Folders...');
    const getAllResult = await apiService.getFolders();
    console.log('✅ Folders retrieved:', getAllResult.data.length, 'items\n');

    // 3. Get Folder by ID
    console.log('3️⃣ Testing Get Folder by ID...');
    const getByIdResult = await apiService.getFolderById(folderId);
    console.log('✅ Folder retrieved:', getByIdResult.data.name, '\n');

    // 4. Update Folder
    console.log('4️⃣ Testing Update Folder...');
    const updateResult = await apiService.updateFolder(folderId, {
      name: 'Updated Test Folder',
      color: '#10B981',
    });
    console.log('✅ Folder updated:', updateResult.data.name, '\n');

    // 5. Delete Folder
    console.log('5️⃣ Testing Delete Folder...');
    await apiService.deleteFolder(folderId);
    console.log('✅ Folder deleted\n');

    return { success: true, message: 'All folder tests passed!' };
  } catch (error) {
    console.error('❌ Folder test failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test Agent Flow
 */
export const testAgentFlow = async () => {
  console.log('🧪 Testing Agent Flow...\n');

  try {
    console.log('1️⃣ Testing Agent Decision...');
    const result = await apiService.agentDecide(
      {
        userId: 'test-user',
        persona: 'student',
        currentTask: 'bookmark categorization',
      },
      'categorize',
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        title: 'JavaScript | MDN',
      }
    );
    
    console.log('✅ Agent decision received:', result);
    return { success: true, message: 'Agent test passed!' };
  } catch (error) {
    console.error('❌ Agent test failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Run all API tests
 */
export const runAllTests = async () => {
  console.log('🚀 Running All API Tests\n');
  console.log('================================\n');

  const results = {
    auth: await testAuthFlow(),
    resources: await testResourcesFlow(),
    folders: await testFoldersFlow(),
    agent: await testAgentFlow(),
  };

  console.log('\n================================');
  console.log('📊 Test Results Summary\n');
  
  Object.entries(results).forEach(([name, result]) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${name}: ${result.message || result.error}`);
  });

  const allPassed = Object.values(results).every(r => r.success);
  console.log('\n' + (allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'));
  
  return results;
};

/**
 * Quick test for checking API connection
 */
export const testConnection = async () => {
  try {
    console.log('🔌 Testing API connection...');
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('✅ API is reachable:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    return { success: false, error: error.message };
  }
};
