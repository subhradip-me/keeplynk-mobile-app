import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar} from 'react-native';
import { store } from './src/app/store';
import RootStack from './src/navigations/RootStack';

export default function App() {
  console.log('App rendering...');
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffffff" />
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}