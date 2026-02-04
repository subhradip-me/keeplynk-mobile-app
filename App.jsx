import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { store } from './src/app/store';
import RootStack from './src/navigations/RootStack';
import { useTheme } from './src/features/theme/themeHooks';

function AppContent() {
  const { colors, isDark } = useTheme();
  
  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.backgroundSecondary} 
      />
      <RootStack />
    </NavigationContainer>
  );
}

export default function App() {
  console.log('App rendering...');
  
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}