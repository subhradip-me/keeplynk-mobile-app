import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FoldersStack from './FoldersStack';
import AddResourceModal from '../modals/AddResourceModal';
import { useResources } from '../features/resources/resourceHooks';

const Tab = createBottomTabNavigator();

const getIconConfig = (routeName, focused) => {
  if (routeName === 'Home') {
    return { name: 'home-filled', size: 24 };
  } else if (routeName === 'Search') {
    return { name: 'search', size: 24 };
  } else if (routeName === 'Folders') {
    return { name: 'folder-open', size: 24 };
  } else if (routeName === 'Add') {
    return { name: 'add-circle-outline', size: 28 };
  }
  return { name: 'help', size: 24 };
};

// Move tabBarIcon outside of BottomTabs to avoid redefining it on every render
const tabBarIcon = (route) => ({ focused, color }) => {
  const { name, size } = getIconConfig(route.name, focused);
  return <Icon name={name} size={size} color={color} />;
};

export default function BottomTabs() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { createResource } = useResources();

  const handleSaveResource = (resource) => {
    createResource({
      type: 'url',
      url: resource.url,
      title: resource.title,
      folderId: resource.folder !== 'Uncategorised' ? resource.folder : null,
    });
  };

  return (
    <>
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: tabBarIcon(route),
        tabBarActiveTintColor: '#2383E2',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#ffffffff',
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000000ff',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Folders" component={FoldersStack} />
      <Tab.Screen 
        name="Add" 
        component={HomeScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            setIsAddModalVisible(true);
          },
        }}
      />
    </Tab.Navigator>

    <AddResourceModal
      visible={isAddModalVisible}
      onClose={() => setIsAddModalVisible(false)}
      onSave={handleSaveResource}
    />
    </>
  );
}
