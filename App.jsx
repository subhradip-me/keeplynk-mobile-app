import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { store } from './src/app/store';
import RootStack from './src/navigations/RootStack';
import { useTheme } from './src/features/theme/themeHooks';
import ShareHandler from './src/components/ShareHandler';

function AppContent() {
  const { colors, isDark } = useTheme();
  const [sharedData, setSharedData] = useState(null);
  
  const handleShareReceived = (data) => {
    console.log('🎯 Share data received in App:', data);
    setSharedData(data);
  };
  
  return (
    <>
      <ShareHandler onShareReceived={handleShareReceived} />
      <NavigationContainer>
        <StatusBar 
          barStyle={isDark ? "light-content" : "dark-content"} 
          backgroundColor={colors.backgroundSecondary} 
        />
        <RootStack sharedData={sharedData} onShareProcessed={() => setSharedData(null)} />
      </NavigationContainer>
    </>
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