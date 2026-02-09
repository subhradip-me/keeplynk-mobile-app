import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import AuthScreen from '../screens/AuthScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrashScreen from '../screens/TrashScreen';
import LoadingScreen from '../screens/LoadingScreen';
import { useAuth, useAuthInit } from '../features/auth/authHooks';
import { useTheme } from '../features/theme';

const Stack = createNativeStackNavigator();

export default function RootStack({ sharedData, onShareProcessed }) {
  useAuthInit(); // Initialize auth on app startup
  const { isAuthenticated, loading } = useAuth();
  const { colors } = useTheme();

  console.log('RootStack render:', { isAuthenticated, loading });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? 'Main' : 'Auth'}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Main">
        {props => <BottomTabs {...props} sharedData={sharedData} onShareProcessed={onShareProcessed} />}
      </Stack.Screen>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Trash" component={TrashScreen} />
    </Stack.Navigator>
  );
}
 