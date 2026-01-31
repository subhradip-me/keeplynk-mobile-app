import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import EmptyState from '../components/EmptyState';
import LinkItem from '../components/LinkItem';
import { useResources } from '../features/resources/resourceHooks';

export default function FavoritesScreen() {
  const { resources, fetchResources } = useResources();
  const favorites = useMemo(() => resources.filter(r => r.isFavorite), [resources]);
  
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);
  
  const handleLinkPress = useCallback((resource) => console.log('Resource pressed:', resource), []);

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
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      {favorites.length === 0 ? (
        <EmptyState
          icon="favorite-border"
          title="No Favorites Yet"
          message="Mark links as favorites to quickly access them here"
        />
      ) : (
        <FlatList
          data={favorites}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#37352F',
    letterSpacing: -0.5,
  },
  linkList: {
    padding: 12,
    paddingBottom: 32,
  },
});
