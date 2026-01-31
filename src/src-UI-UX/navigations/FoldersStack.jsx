import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoldersScreen from '../screens/FoldersScreen';
import FolderDetailScreen from '../screens/FolderDetailScreen';

const Stack = createNativeStackNavigator();

export default function FoldersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FoldersList" component={FoldersScreen} />
      <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
    </Stack.Navigator>
  );
}