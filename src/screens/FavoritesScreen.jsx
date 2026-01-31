import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

// Simple EmptyState component
const EmptyState = ({ icon, title, message }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
    <Text style={{ fontSize: 48, marginBottom: 16 }}>⭐</Text>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{title}</Text>
    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>{message}</Text>
  </View>
);

// Simple LinkItem component
const LinkItem = ({ title, url, description, folder, isFavorite, onPress }) => (
  <TouchableOpacity style={linkItemStyles.container} onPress={onPress}>
    <View style={linkItemStyles.content}>
      <Text style={linkItemStyles.title} numberOfLines={1}>{title || 'Untitled'}</Text>
      <Text style={linkItemStyles.url} numberOfLines={1}>{url}</Text>
      {description && <Text style={linkItemStyles.description} numberOfLines={2}>{description}</Text>}
    </View>
    <Text style={linkItemStyles.favorite}>{isFavorite ? '⭐' : ''}</Text>
  </TouchableOpacity>
);

const linkItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  url: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  favorite: {
    fontSize: 20,
  },
});

export default function FavoritesScreen() {
  const { items: resources = [] } = useSelector((state) => state.resources);
  const favorites = useMemo(() => resources.filter(r => r.isFavorite), [resources]);
  
  const handleLinkPress = useCallback((resource) => console.log('Resource pressed:', resource), []);

  const renderItem = useCallback(({ item }) => (
    <LinkItem
      title={item.title}
      url={item.url}
      description={item.description}
      folder={item.folderName}
      isFavorite={item.isFavorite}
      onPress={() => handleLinkPress(item)}
    />
  ), [handleLinkPress]);

  const keyExtractor = useCallback((item) => item._id || item.id, []);

  return (
    <View style={styles.safeArea}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
