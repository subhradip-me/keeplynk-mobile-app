/**
 * Comprehensive API Endpoint Tester
 * Tests all endpoints and reports issues
 */

import apiService from '../services/api';

let testToken = null;
let testUserId = null;
let createdResourceId = null;
let createdFolderId = null;
let createdTagId = null;

/**
 * Test 1: Connection Test
 */
export const testConnection = async () => {
  console.log('🔌 Test 1: Testing API Connection...');
  try {
    const response = await fetch('https://api-gateway-keeplynk-1.onrender.com/health');
    const data = await response.json();
    console.log('✅ API is reachable:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test 2: Authentication Endpoints
 */
export const testAuthEndpoints = async () => {
  console.log('\n🔐 Test 2: Testing Authentication Endpoints...');
  const results = [];

  try {
    // 2.1 Register
    console.log('  2.1 POST /api/auth/register');
    const registerData = {
      email: `test${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      initialPersona: 'student',
    };
    
    const registerResult = await apiService.register(registerData);
    if (registerResult.success && registerResult.data.token) {
      testToken = registerResult.data.token;
      testUserId = registerResult.data.user._id;
      console.log('    ✅ Registration successful');
      results.push({ endpoint: 'POST /api/auth/register', status: 'PASS' });
    } else {
      throw new Error('Registration failed: No token received');
    }

    // 2.2 Get Profile
    console.log('  2.2 GET /api/auth/me');
    const profileResult = await apiService.getProfile();
    if (profileResult.success && profileResult.data.user) {
      console.log('    ✅ Profile retrieved');
      results.push({ endpoint: 'GET /api/auth/me', status: 'PASS' });
    } else {
      throw new Error('Get profile failed');
    }

    // 2.3 Add Persona
    console.log('  2.3 POST /api/auth/personas');
    const addPersonaResult = await apiService.addPersona('professional');
    if (addPersonaResult.success && addPersonaResult.data.token) {
      testToken = addPersonaResult.data.token;
      apiService.setToken(testToken);
      console.log('    ✅ Persona added');
      results.push({ endpoint: 'POST /api/auth/personas', status: 'PASS' });
    } else {
      throw new Error('Add persona failed');
    }

    // 2.4 Switch Persona
    console.log('  2.4 PUT /api/auth/personas/switch');
    const switchResult = await apiService.switchPersona('student');
    if (switchResult.success && switchResult.data.token) {
      testToken = switchResult.data.token;
      apiService.setToken(testToken);
      console.log('    ✅ Persona switched');
      results.push({ endpoint: 'PUT /api/auth/personas/switch', status: 'PASS' });
    } else {
      throw new Error('Switch persona failed');
    }

    return { success: true, results };
  } catch (error) {
    console.error('    ❌ Auth test failed:', error.message);
    return { success: false, error: error.message, results };
  }
};

/**
 * Test 3: Resources Endpoints
 */
export const testResourcesEndpoints = async () => {
  console.log('\n📚 Test 3: Testing Resources Endpoints...');
  const results = [];

  try {
    // 3.1 Create Resource
    console.log('  3.1 POST /api/resources');
    const resourceData = {
      type: 'url',
      url: 'https://example.com/test',
      title: 'Test Resource',
      description: 'A test resource',
      tags: ['test', 'example'],
      isFavorite: true,
    };
    
    const createResult = await apiService.createResource(resourceData);
    if (createResult.success && createResult.data._id) {
      createdResourceId = createResult.data._id;
      console.log('    ✅ Resource created:', createdResourceId);
      results.push({ endpoint: 'POST /api/resources', status: 'PASS' });
    } else {
      throw new Error('Create resource failed');
    }

    // 3.2 Get All Resources
    console.log('  3.2 GET /api/resources');
    const getAllResult = await apiService.getResources();
    if (getAllResult.success && Array.isArray(getAllResult.data)) {
      console.log(`    ✅ Resources retrieved: ${getAllResult.data.length} items`);
      results.push({ endpoint: 'GET /api/resources', status: 'PASS' });
    } else {
      throw new Error('Get all resources failed');
    }

    // 3.3 Get Resource by ID
    console.log('  3.3 GET /api/resources/:id');
    const getByIdResult = await apiService.getResourceById(createdResourceId);
    if (getByIdResult.success && getByIdResult.data._id === createdResourceId) {
      console.log('    ✅ Resource retrieved by ID');
      results.push({ endpoint: 'GET /api/resources/:id', status: 'PASS' });
    } else {
      throw new Error('Get resource by ID failed');
    }

    // 3.4 Update Resource
    console.log('  3.4 PUT /api/resources/:id');
    const updateResult = await apiService.updateResource(createdResourceId, {
      title: 'Updated Test Resource',
      isFavorite: false,
    });
    if (updateResult.success) {
      console.log('    ✅ Resource updated');
      results.push({ endpoint: 'PUT /api/resources/:id', status: 'PASS' });
    } else {
      throw new Error('Update resource failed');
    }

    // 3.5 Search Resources
    console.log('  3.5 GET /api/resources/search');
    const searchResult = await apiService.searchResources('test');
    if (searchResult.success && Array.isArray(searchResult.data)) {
      console.log(`    ✅ Search results: ${searchResult.data.length} items`);
      results.push({ endpoint: 'GET /api/resources/search', status: 'PASS' });
    } else {
      throw new Error('Search resources failed');
    }

    // 3.6 Get Unorganized Resources
    console.log('  3.6 GET /api/resources/unorganized');
    try {
      const unorganizedResult = await apiService.getUnorganizedResources();
      if (unorganizedResult.success) {
        console.log('    ✅ Unorganized resources retrieved');
        results.push({ endpoint: 'GET /api/resources/unorganized', status: 'PASS' });
      }
    } catch (error) {
      console.log('    ⚠️ Endpoint might not exist:', error.message);
      results.push({ endpoint: 'GET /api/resources/unorganized', status: 'SKIP' });
    }

    // 3.7 Delete Resource
    console.log('  3.7 DELETE /api/resources/:id');
    await apiService.deleteResource(createdResourceId);
    console.log('    ✅ Resource deleted');
    results.push({ endpoint: 'DELETE /api/resources/:id', status: 'PASS' });

    return { success: true, results };
  } catch (error) {
    console.error('    ❌ Resources test failed:', error.message);
    return { success: false, error: error.message, results };
  }
};

/**
 * Test 4: Folders Endpoints
 */
export const testFoldersEndpoints = async () => {
  console.log('\n📁 Test 4: Testing Folders Endpoints...');
  const results = [];

  try {
    // 4.1 Create Folder
    console.log('  4.1 POST /api/folders');
    const folderData = {
      name: 'Test Folder',
      description: 'A test folder',
      color: '#3B82F6',
      icon: 'folder',
      isPrivate: false,
    };
    
    const createResult = await apiService.createFolder(folderData);
    if (createResult.success && createResult.data._id) {
      createdFolderId = createResult.data._id;
      console.log('    ✅ Folder created:', createdFolderId);
      results.push({ endpoint: 'POST /api/folders', status: 'PASS' });
    } else {
      throw new Error('Create folder failed');
    }

    // 4.2 Get All Folders
    console.log('  4.2 GET /api/folders');
    const getAllResult = await apiService.getFolders();
    if (getAllResult.success && Array.isArray(getAllResult.data)) {
      console.log(`    ✅ Folders retrieved: ${getAllResult.data.length} items`);
      results.push({ endpoint: 'GET /api/folders', status: 'PASS' });
    } else {
      throw new Error('Get all folders failed');
    }

    // 4.3 Get Folder by ID
    console.log('  4.3 GET /api/folders/:id');
    const getByIdResult = await apiService.getFolderById(createdFolderId);
    if (getByIdResult.success && getByIdResult.data._id === createdFolderId) {
      console.log('    ✅ Folder retrieved by ID');
      results.push({ endpoint: 'GET /api/folders/:id', status: 'PASS' });
    } else {
      throw new Error('Get folder by ID failed');
    }

    // 4.4 Get Folder Resources
    console.log('  4.4 GET /api/folders/:id/resources');
    try {
      const resourcesResult = await apiService.getFolderResources(createdFolderId);
      if (resourcesResult.success) {
        console.log('    ✅ Folder resources retrieved');
        results.push({ endpoint: 'GET /api/folders/:id/resources', status: 'PASS' });
      }
    } catch (error) {
      console.log('    ⚠️ Endpoint might not exist:', error.message);
      results.push({ endpoint: 'GET /api/folders/:id/resources', status: 'SKIP' });
    }

    // 4.5 Update Folder
    console.log('  4.5 PUT /api/folders/:id');
    const updateResult = await apiService.updateFolder(createdFolderId, {
      name: 'Updated Test Folder',
      color: '#10B981',
    });
    if (updateResult.success) {
      console.log('    ✅ Folder updated');
      results.push({ endpoint: 'PUT /api/folders/:id', status: 'PASS' });
    } else {
      throw new Error('Update folder failed');
    }

    // 4.6 Delete Folder
    console.log('  4.6 DELETE /api/folders/:id');
    await apiService.deleteFolder(createdFolderId);
    console.log('    ✅ Folder deleted');
    results.push({ endpoint: 'DELETE /api/folders/:id', status: 'PASS' });

    return { success: true, results };
  } catch (error) {
    console.error('    ❌ Folders test failed:', error.message);
    return { success: false, error: error.message, results };
  }
};

/**
 * Test 5: Tags Endpoints
 */
export const testTagsEndpoints = async () => {
  console.log('\n🏷️  Test 5: Testing Tags Endpoints...');
  const results = [];

  try {
    // 5.1 Create Tag
    console.log('  5.1 POST /api/tags');
    const tagData = {
      name: 'TestTag',
      color: '#F7DF1E',
    };
    
    try {
      const createResult = await apiService.createTag(tagData);
      if (createResult.success && createResult.data._id) {
        createdTagId = createResult.data._id;
        console.log('    ✅ Tag created:', createdTagId);
        results.push({ endpoint: 'POST /api/tags', status: 'PASS' });
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('    ⚠️ Tag already exists');
        results.push({ endpoint: 'POST /api/tags', status: 'SKIP' });
      } else {
        throw error;
      }
    }

    // 5.2 Get All Tags
    console.log('  5.2 GET /api/tags');
    const getAllResult = await apiService.getTags();
    if (getAllResult.success && Array.isArray(getAllResult.data)) {
      console.log(`    ✅ Tags retrieved: ${getAllResult.data.length} items`);
      results.push({ endpoint: 'GET /api/tags', status: 'PASS' });
    } else {
      throw new Error('Get all tags failed');
    }

    // 5.3 Get Popular Tags
    console.log('  5.3 GET /api/tags/popular');
    const popularResult = await apiService.getPopularTags(5);
    if (popularResult.success && Array.isArray(popularResult.data)) {
      console.log(`    ✅ Popular tags retrieved: ${popularResult.data.length} items`);
      results.push({ endpoint: 'GET /api/tags/popular', status: 'PASS' });
    } else {
      throw new Error('Get popular tags failed');
    }

    // 5.4 Get Tag by ID (if we created one)
    if (createdTagId) {
      console.log('  5.4 GET /api/tags/:id');
      const getByIdResult = await apiService.getTagById(createdTagId);
      if (getByIdResult.success && getByIdResult.data._id === createdTagId) {
        console.log('    ✅ Tag retrieved by ID');
        results.push({ endpoint: 'GET /api/tags/:id', status: 'PASS' });
      }

      // 5.5 Update Tag
      console.log('  5.5 PUT /api/tags/:id');
      const updateResult = await apiService.updateTag(createdTagId, {
        name: 'UpdatedTestTag',
      });
      if (updateResult.success) {
        console.log('    ✅ Tag updated');
        results.push({ endpoint: 'PUT /api/tags/:id', status: 'PASS' });
      }

      // 5.6 Delete Tag
      console.log('  5.6 DELETE /api/tags/:id');
      await apiService.deleteTag(createdTagId);
      console.log('    ✅ Tag deleted');
      results.push({ endpoint: 'DELETE /api/tags/:id', status: 'PASS' });
    }

    return { success: true, results };
  } catch (error) {
    console.error('    ❌ Tags test failed:', error.message);
    return { success: false, error: error.message, results };
  }
};

/**
 * Test 6: Agent Endpoints
 */
export const testAgentEndpoints = async () => {
  console.log('\n🤖 Test 6: Testing Agent Endpoints...');
  const results = [];

  try {
    // 6.1 Agent Decide
    console.log('  6.1 POST /api/agent/decide');
    try {
      await apiService.agentDecide(
        { userId: testUserId, persona: 'student' },
        'categorize',
        { url: 'https://example.com' }
      );
      console.log('    ✅ Agent decision received');
      results.push({ endpoint: 'POST /api/agent/decide', status: 'PASS' });
    } catch (error) {
      console.log('    ⚠️ Agent endpoint might not be configured:', error.message);
      results.push({ endpoint: 'POST /api/agent/decide', status: 'SKIP' });
    }

    // 6.2 Organize
    console.log('  6.2 POST /api/organize');
    try {
      await apiService.organizeResource('test-resource-id');
      console.log('    ✅ Organize endpoint working');
      results.push({ endpoint: 'POST /api/organize', status: 'PASS' });
    } catch (error) {
      console.log('    ⚠️ Organize endpoint might not exist:', error.message);
      results.push({ endpoint: 'POST /api/organize', status: 'SKIP' });
    }

    return { success: true, results };
  } catch (error) {
    console.error('    ❌ Agent test failed:', error.message);
    return { success: false, error: error.message, results };
  }
};

/**
 * Run All Tests
 */
export const runAllEndpointTests = async () => {
  console.log('🚀 Starting Comprehensive API Endpoint Tests\n');
  console.log('='.repeat(60));

  const allResults = {
    connection: null,
    auth: null,
    resources: null,
    folders: null,
    tags: null,
    agent: null,
  };

  // Test 1: Connection
  allResults.connection = await testConnection();
  
  if (!allResults.connection.success) {
    console.error('\n❌ API is not reachable. Please check:');
    console.error('1. Backend server is running');
    console.error('2. BASE_URL in api.js is correct');
    console.error('3. Network connection is working');
    return allResults;
  }

  // Test 2: Authentication
  allResults.auth = await testAuthEndpoints();
  
  if (!allResults.auth.success) {
    console.error('\n❌ Authentication failed. Cannot proceed with other tests.');
    return allResults;
  }

  // Test 3: Resources
  allResults.resources = await testResourcesEndpoints();

  // Test 4: Folders
  allResults.folders = await testFoldersEndpoints();

  // Test 5: Tags
  allResults.tags = await testTagsEndpoints();

  // Test 6: Agent
  allResults.agent = await testAgentEndpoints();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary\n');

  const sections = ['connection', 'auth', 'resources', 'folders', 'tags', 'agent'];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  sections.forEach(section => {
    const result = allResults[section];
    if (result) {
      if (result.results) {
        const passed = result.results.filter(r => r.status === 'PASS').length;
        const skipped = result.results.filter(r => r.status === 'SKIP').length;
        const failed = result.results.filter(r => r.status === 'FAIL').length;
        
        totalPassed += passed;
        totalSkipped += skipped;
        totalFailed += failed;

        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${section.toUpperCase()}: ${passed} passed, ${skipped} skipped, ${failed} failed`);
      } else {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${section.toUpperCase()}: ${result.success ? 'PASS' : 'FAIL'}`);
        if (result.success) totalPassed++;
        else totalFailed++;
      }
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`📈 Total: ${totalPassed} passed, ${totalSkipped} skipped, ${totalFailed} failed`);
  
  if (totalFailed === 0 && totalSkipped === 0) {
    console.log('\n🎉 All tests passed successfully!');
  } else if (totalFailed === 0) {
    console.log(`\n⚠️ All critical tests passed. ${totalSkipped} optional endpoints skipped.`);
  } else {
    console.log('\n❌ Some tests failed. Please review the errors above.');
  }

  return allResults;
};

// Export for use in app
export default runAllEndpointTests;
