import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { makeResourceFavorite } from '../features/resources/resourceThunk';
import { useResources } from '../features/resources/resourceHooks';
import LinkItem from '../components/LinkItem';
import MoveToFolderSheet from '../modals/MoveToFolderSheet';

// Simple EmptyState component
const EmptyState = ({ icon, title, message }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
    <Text style={{ fontSize: 48, marginBottom: 16 }}>⭐</Text>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{title}</Text>
    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>{message}</Text>
  </View>
);

export default function FavoritesScreen() {
  const dispatch = useDispatch();
  const { deleteResource, updateResource } = useResources();
  const { items: resources = [] } = useSelector((state) => state.resources);
  const favorites = useMemo(() => resources.filter(r => r.isFavorite), [resources]);
  const [moveToFolderSheetVisible, setMoveToFolderSheetVisible] = useState(false);
  const [resourceToMove, setResourceToMove] = useState(null);
  
  const handleLinkPress = useCallback((resource) => console.log('Resource pressed:', resource), []);
  
  const handleToggleFavorite = useCallback(async (resource) => {
    try {
      await dispatch(makeResourceFavorite({ id: resource._id || resource.id, isFavorite: resource.isFavorite })).unwrap();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, [dispatch]);

  const handleDelete = useCallback(async (resource) => {
    try {
      await deleteResource(resource._id || resource.id);
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  }, [deleteResource]);

  const handleMoveToFolder = useCallback(async (folderId) => {
    if (!resourceToMove) return;
    
    try {
      await updateResource(resourceToMove._id || resourceToMove.id, { folderId });
      setMoveToFolderSheetVisible(false);
      setResourceToMove(null);
    } catch (error) {
      console.error('Failed to move resource:', error);
    }
  }, [resourceToMove, updateResource]);

  const renderItem = useCallback(({ item }) => (
    <LinkItem
      title={item.title}
      url={item.url}
      description={item.description}
      tags={item.tags}
      folder={item.folderName || item.folder}
      isFavorite={item.isFavorite}
      type={item.type}
      onPress={() => handleLinkPress(item)}
      onMoveToFolder={() => {
        setResourceToMove(item);
        setMoveToFolderSheetVisible(true);
      }}
      onToggleFavorite={() => handleToggleFavorite(item)}
      onDelete={() => handleDelete(item)}
    />
  ), [handleLinkPress, handleToggleFavorite, handleDelete]);

  const keyExtractor = useCallback((item) => item._id || item.id || String(item.url), []);

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

      <MoveToFolderSheet
        visible={moveToFolderSheetVisible}
        onClose={() => {
          setMoveToFolderSheetVisible(false);
          setResourceToMove(null);
        }}
        onMove={handleMoveToFolder}
        currentFolderId={resourceToMove?.folderId || null}
        resourceTitle={resourceToMove?.title}
      />
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
