import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinkItem from '../components/LinkItem';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';
import { restoreResourceFromTrash, deleteResource, fetchResources } from '../features/resources/resourceThunk';

// Simple EmptyState component for trash
const EmptyState = ({ icon, title, message }) => (
  <View style={styles.emptyStateContainer}>
    <Icon name={icon} size={80} color="#C5C4C0" />
    <Text style={styles.emptyStateTitle}>{title}</Text>
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

export default function TrashScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { resources = [] } = useResources();
  const { folders } = useFolders();
  
  // Create a folder lookup map
  const folderMap = useMemo(() => {
    const map = {};
    folders?.forEach(folder => {
      map[folder._id] = { name: folder.name, color: folder.color };
    });
    return map;
  }, [folders]);
  
  // Filter deleted resources
  const trashedResources = useMemo(() => 
    resources.filter(r => r.isTrashed), 
    [resources]
  );

  const handleRestore = useCallback(async (resource) => {
    Alert.alert(
      'Restore Item',
      `Restore "${resource.title}" from trash?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          onPress: async () => {
            try {
              await dispatch(restoreResourceFromTrash(resource._id)).unwrap();
              // Silently refetch in background to get properly populated tags
              dispatch(fetchResources());
            } catch (error) {
              Alert.alert('Error', 'Failed to restore resource');
              console.error('Failed to restore resource:', error);
            }
          }
        },
      ]
    );
  }, [dispatch]);

  const handlePermanentDelete = useCallback(async (resource) => {
    Alert.alert(
      'Delete Permanently',
      `Permanently delete "${resource.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteResource(resource._id)).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete resource');
              console.error('Failed to delete resource:', error);
            }
          }
        },
      ]
    );
  }, [dispatch]);

  const handleEmptyTrash = useCallback(async () => {
    if (trashedResources.length === 0) return;
    
    Alert.alert(
      'Empty Trash',
      `Permanently delete all ${trashedResources.length} items? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Empty Trash', 
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                trashedResources.map(resource => 
                  dispatch(deleteResource(resource._id)).unwrap()
                )
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to empty trash');
              console.error('Failed to empty trash:', error);
            }
          }
        },
      ]
    );
  }, [trashedResources, dispatch]);

  const handleRestoreAll = useCallback(async () => {
    if (trashedResources.length === 0) return;
    
    Alert.alert(
      'Restore All',
      `Restore all ${trashedResources.length} items from trash?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore All', 
          onPress: async () => {
            try {
              await Promise.all(
                trashedResources.map(resource => 
                  dispatch(restoreResourceFromTrash(resource._id)).unwrap()
                )
              );
              // Silently refetch in background to get properly populated tags
              dispatch(fetchResources());
            } catch (error) {
              Alert.alert('Error', 'Failed to restore all resources');
              console.error('Failed to restore all resources:', error);
            }
          }
        },
      ]
    );
  }, [trashedResources, dispatch]);

  const renderTrashItem = useCallback(({ item }) => (
    <LinkItem
      title={item.title}
      url={item.url}
      description={item.description}
      tags={item.tags}
      folder={item.folderName || (item.folderId ? folderMap[item.folderId] : null)}
      isFavorite={item.isFavorite}
      type={item.type}
      onPress={() => {}} // No action on press in trash
      onEdit={() => handleRestore(item)} // Use edit for restore
      onMoveToFolder={() => {}} // Disable move in trash
      onDelete={() => handlePermanentDelete(item)}
      onToggleFavorite={() => {}} // Disable favorite toggle in trash
    />
  ), [handleRestore, handlePermanentDelete, folderMap]);

  const keyExtractor = useCallback((item) => item._id || item.id || String(item.url), []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#37352F" />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.trashIcon}>
            <Icon name="delete" size={24} color="#EF4444" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Trash</Text>
            <Text style={styles.itemCount}>{trashedResources.length} items</Text>
          </View>
        </View>
      </View>

      {/* Action Bar */}
      {trashedResources.length > 0 && (
        <View style={styles.actionBar}>
          <Pressable 
            style={styles.actionBarButton}
            onPress={handleRestoreAll}
          >
            <Icon name="restore" size={18} color="#2563EB" />
            <Text style={styles.actionBarButtonText}>Restore All</Text>
          </Pressable>
          <View style={styles.actionBarDivider} />
          <Pressable 
            style={styles.actionBarButton}
            onPress={handleEmptyTrash}
          >
            <Icon name="delete-forever" size={18} color="#EF4444" />
            <Text style={[styles.actionBarButtonText, styles.actionBarButtonTextDanger]}>
              Empty Trash
            </Text>
          </Pressable>
        </View>
      )}

      {/* Trash List */}
      {trashedResources.length === 0 ? (
        <EmptyState
          icon="delete-outline"
          title="Trash is Empty"
          message="Deleted items will appear here for 30 days before being permanently removed"
        />
      ) : (
        <FlatList
          data={trashedResources}
          renderItem={renderTrashItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Info Banner */}
      {trashedResources.length > 0 && (
        <View style={styles.infoBanner}>
          <Icon name="info-outline" size={16} color="#787774" />
          <Text style={styles.infoBannerText}>
            Items in trash are automatically deleted after 30 days
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trashIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37352F',
    letterSpacing: -0.3,
  },
  itemCount: {
    fontSize: 13,
    color: '#787774',
    marginTop: 2,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
    gap: 12,
  },
  actionBarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F7F6F3',
  },
  actionBarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  actionBarButtonTextDanger: {
    color: '#EF4444',
  },
  actionBarDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EBEBEA',
  },
  list: {
    padding: 12,
    paddingBottom: 32,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37352F',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#787774',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F6F3',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEA',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#787774',
    lineHeight: 16,
  },
});
