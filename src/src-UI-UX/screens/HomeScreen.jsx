import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import HomeTabs from '../components/HomeTabs';
import LinkItem from '../components/LinkItem';
import AccountSheet from '../modals/AccountSheet';
import { useAuth } from '../features/auth/authHooks';
import { useResources } from '../features/resources/resourceHooks';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { resources, fetchResources } = useResources();
  const [activeTab, setActiveTab] = useState('All');
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleMorePress = useCallback(() => console.log('More pressed'), []);
  const handleLinkPress = useCallback((link) => console.log('Link pressed:', link), []);

  // Filter resources based on active tab
  const filteredResources = useMemo(() => {
    switch (activeTab) {
      case 'All':
        return resources;
      
      case 'Recent':
        return [...resources].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      
      case 'Uncategorised':
        return resources.filter(
          resource => !resource.folderId || resource.folderName === 'Uncategorised'
        );
      
      case 'Favourite':
        return resources.filter(resource => resource.isFavorite);
      
      default:
        return resources;
    }
  }, [activeTab, resources]);

  const renderItem = useCallback(({ item }) => (
    <LinkItem
      title={item.title}
      url={item.url}
      description={item.description}
      tags={item.tags}
      folder={item.folderName}
      isFavorite={item.isFavorite}
      type={item.type}
      onPress={() => handleLinkPress(item)}
    />
  ), [handleLinkPress]);

  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <View style={styles.container}>
      {/* Global Header */}
      <Header
        onAccountPress={() => setAccountSheetVisible(true)}
        onMorePress={handleMorePress}
      />

      {/* Internal Tabs (filters, not navigation) */}
      <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Link List */}
      <FlatList
        data={filteredResources}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.linkList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
      />

      <AccountSheet 
        visible={accountSheetVisible}
        onClose={() => setAccountSheetVisible(false)}
        user={user}
        onAccountDetails={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFA',
  },
  linkList: {
    padding: 12,
    paddingBottom: 32,
  },
});
