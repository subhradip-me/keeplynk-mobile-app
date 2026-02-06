/**
 * Auto Organize Feature Usage Example
 * 
 * This example shows how to use the auto-organize functionality
 * to automatically organize resources using AI.
 */

import React from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import {
  useAutoOrganize,
  useAutoOrganizing,
  useAutoOrganizeStatus,
  useAutoOrganizeMessage,
  useOrganizeError,
  useClearAutoOrganizeStatus,
} from '../features/organise';

const AutoOrganizeExample = () => {
  const autoOrganize = useAutoOrganize();
  const isOrganizing = useAutoOrganizing();
  const status = useAutoOrganizeStatus();
  const message = useAutoOrganizeMessage();
  const error = useOrganizeError();
  const clearStatus = useClearAutoOrganizeStatus();

  const handleAutoOrganize = async () => {
    try {
      // Organize up to 50 resources (default)
      await autoOrganize(50).unwrap();
      
      // Or specify a different limit
      // await autoOrganize(100).unwrap();
    } catch (err) {
      console.error('Auto organize failed:', err);
    }
  };

  return (
    <View>
      <Button
        title="Auto Organize Resources"
        onPress={handleAutoOrganize}
        disabled={isOrganizing}
      />

      {isOrganizing && (
        <View>
          <ActivityIndicator />
          <Text>Organizing resources...</Text>
        </View>
      )}

      {status && (
        <View>
          <Text>Status: {status}</Text>
          <Text>{message}</Text>
          <Button title="Clear" onPress={clearStatus} />
        </View>
      )}

      {error && (
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      )}
    </View>
  );
};

export default AutoOrganizeExample;

/**
 * Direct API Usage (without Redux)
 */
import organizeAPI from '../services/organize';

const directAPIExample = async () => {
  try {
    const result = await organizeAPI.autoOrganize(50);
    
    console.log('Success:', result.success);
    console.log('Status:', result.status);
    console.log('Message:', result.message);
    console.log('Limit:', result.limit);
    
    // Expected response:
    // {
    //   "success": true,
    //   "status": "started",
    //   "message": "Auto organise in progress. Your resources are being organized.",
    //   "limit": 50
    // }
  } catch (error) {
    console.error('Error:', error);
  }
};
