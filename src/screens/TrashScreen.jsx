import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinkItem from '../components/LinkItem';

// Simple EmptyState component for trash
const EmptyState = ({ icon, title, message }) => (
  <View style={styles.emptyStateContainer}>
    <Icon name={icon} size={80} color="#C5C4C0" />
    <Text style={styles.emptyStateTitle}>{title}</Text>
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

export default function TrashScreen() {
  const navigation = useNavigation();
  const { items: resources = [] } = useSelector((state) => state.resources);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Filter deleted resources (assuming we'll add a 'deleted' or 'isDeleted' flag)
  const trashedResources = useMemo(() => 
    resources.filter(r => r.isDeleted || r.deleted), 
    [resources]
  );

  const handleRestore = useCallback((resource) => {
    Alert.alert(
      'Restore Item',
      `Restore "${resource.title}" from trash?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          onPress: () => {
            console.log('Restore resource:', resource);
            // TODO: Implement restore functionality
          }
        },
      ]
    );
  }, []);

  const handlePermanentDelete = useCallback((resource) => {
    Alert.alert(
      'Delete Permanently',
      `Permanently delete "${resource.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            console.log('Permanently delete resource:', resource);
            // TODO: Implement permanent delete functionality
          }
        },
      ]
    );
  }, []);

  const handleEmptyTrash = useCallback(() => {
    if (trashedResources.length === 0) return;
    
    Alert.alert(
      'Empty Trash',
      `Permanently delete all ${trashedResources.length} items? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Empty Trash', 
          style: 'destructive',
          onPress: () => {
            console.log('Empty all trash');
            // TODO: Implement empty trash functionality
          }
        },
      ]
    );
  }, [trashedResources.length]);

  const handleRestoreAll = useCallback(() => {
    if (trashedResources.length === 0) return;
    
    Alert.alert(
      'Restore All',
      `Restore all ${trashedResources.length} items from trash?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore All', 
          onPress: () => {
            console.log('Restore all trash');
            // TODO: Implement restore all functionality
          }
        },
      ]
    );
  }, [trashedResources.length]);

  const renderTrashItem = useCallback(({ item }) => (
    <View style={styles.trashItem}>
      <View style={styles.trashItemContent}>
        <View style={styles.trashIconContainer}>
          <Icon name="delete-outline" size={20} color="#EF4444" />
        </View>
        <View style={styles.trashItemDetails}>
          <Text style={styles.trashItemTitle} numberOfLines={1}>
            {item.title || 'Untitled'}
          </Text>
          {item.url && (
            <Text style={styles.trashItemUrl} numberOfLines={1}>
              {item.url}
            </Text>
          )}
          {item.description && (
            <Text style={styles.trashItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <Text style={styles.trashItemDate}>
            Deleted {new Date(item.deletedAt || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.trashItemActions}>
        <Pressable 
          style={styles.actionButton}
          onPress={() => handleRestore(item)}
        >
          <Icon name="restore" size={20} color="#2563EB" />
          <Text style={styles.actionButtonText}>Restore</Text>
        </Pressable>
        <Pressable 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handlePermanentDelete(item)}
        >
          <Icon name="delete-forever" size={20} color="#EF4444" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  ), [handleRestore, handlePermanentDelete]);

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
  trashItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  trashItemContent: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  trashIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashItemDetails: {
    flex: 1,
    gap: 4,
  },
  trashItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#37352F',
    letterSpacing: -0.2,
  },
  trashItemUrl: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 2,
  },
  trashItemDescription: {
    fontSize: 13,
    color: '#787774',
    lineHeight: 18,
    marginTop: 4,
  },
  trashItemDate: {
    fontSize: 11,
    color: '#9B9A97',
    marginTop: 4,
  },
  trashItemActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  deleteButtonText: {
    color: '#EF4444',
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
