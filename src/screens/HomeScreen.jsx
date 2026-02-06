import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import HomeTabs from '../components/HomeTabs';
import LinkItem from '../components/LinkItem';
import EmptyState from '../components/EmptyState';
import AccountSheet from '../modals/AccountSheet';
import EditResourceModal from '../modals/EditResourceModal';
import PreviewResourceModal from '../modals/PreviewResourceModal';
import MoveToFolderSheet from '../modals/MoveToFolderSheet';
import AutoOrganiseSheet from '../modals/AutoOrganiseSheet';
import { useAuth } from '../features/auth/authHooks';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';
import { useAutoOrganize, useAutoOrganizing } from '../features/organise';
import { makeResourceFavorite, moveResourceToTrash, fetchResources as fetchResourcesThunk } from '../features/resources/resourceThunk';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../features/theme';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { resources, fetchResources, updateResource } = useResources();
  const { folders, fetchFolders } = useFolders();
  const { colors } = useTheme();
  const autoOrganize = useAutoOrganize();
  const isAutoOrganizing = useAutoOrganizing();
  const [activeTab, setActiveTab] = useState('All');
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [moveToFolderSheetVisible, setMoveToFolderSheetVisible] = useState(false);
  const [resourceToMove, setResourceToMove] = useState(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);
  const [autoOrganiseSheetVisible, setAutoOrganiseSheetVisible] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchFolders();
  }, [fetchResources, fetchFolders]);

  const handleMorePress = useCallback(() => console.log('More pressed'), []);
  
  const toggleSelection = useCallback((itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleLinkPress = useCallback((link) => {
    if (selectionMode && activeTab === 'Uncategorised') {
      toggleSelection(link._id);
    } else {
      handlePreview(link);
    }
  }, [selectionMode, activeTab, toggleSelection, handlePreview]);

  const handleLongPress = useCallback((link) => {
    if (activeTab === 'Uncategorised') {
      setSelectionMode(true);
      setSelectedItems([link._id]);
    }
  }, [activeTab]);

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedItems([]);
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = filteredResources.map(resource => resource._id);
    setSelectedItems(allIds);
  }, [filteredResources]);

  const handleEdit = useCallback((resource) => {
    setSelectedResource(resource);
    setEditModalVisible(true);
  }, []);

  const handleSaveEdit = useCallback(async (updatedResource) => {
    try {
      if (selectedResource) {
        await updateResource(selectedResource._id, updatedResource);
        // Auto-refresh resources after update
        await fetchResources();
      }
      setEditModalVisible(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Failed to update resource:', error);
      throw error;
    }
  }, [selectedResource, updateResource, fetchResources]);

  const handlePreview = useCallback((resource) => {
    setPreviewResource(resource);
    setPreviewModalVisible(true);
  }, []);

  const handleDelete = useCallback(async (resource) => {
    try {
      await dispatch(moveResourceToTrash(resource._id)).unwrap();
      // Silently refetch in background to get properly populated tags
      dispatch(fetchResourcesThunk());
    } catch (error) {
      console.error('Failed to move resource to trash:', error);
    }
  }, [dispatch]);

  const handleToggleFavorite = useCallback(async (resource) => {
    try {
      await dispatch(makeResourceFavorite({ id: resource._id, isFavorite: resource.isFavorite })).unwrap();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, [dispatch]);

  const handleMoveToFolder = useCallback(async (folderId) => {
    if (!resourceToMove) return;
    
    try {
      await updateResource(resourceToMove._id, { folderId });
      // Auto-refresh resources after moving
      await fetchResources();
      setMoveToFolderSheetVisible(false);
      setResourceToMove(null);
    } catch (error) {
      console.error('Failed to move resource:', error);
      throw error;
    }
  }, [resourceToMove, updateResource, fetchResources]);

  const handleAutoOrganise = useCallback(async () => {
    try {
      // Call the auto-organize API with a limit of 50 resources
      const result = await autoOrganize(50).unwrap();
      
      console.log('Auto organize started:', result);
      
      // Refetch resources immediately and then again after a delay
      await fetchResources();
      await fetchFolders();
      
      // Additional refresh after backend processing
      setTimeout(async () => {
        await fetchResources();
        await fetchFolders();
      }, 3000);
      
      exitSelectionMode();
    } catch (error) {
      console.error('Failed to auto organize:', error);
      throw error;
    }
  }, [autoOrganize, fetchResources, fetchFolders, exitSelectionMode]);

  // const handleDeleteSelected = useCallback(() => {
  //   console.log('Delete selected:', selectedItems);
  //   exitSelectionMode();
  // }, [selectedItems, exitSelectionMode]);

  // const handleMoveSelected = useCallback(() => {
  //   console.log('Move selected:', selectedItems);
  //   exitSelectionMode();
  // }, [selectedItems, exitSelectionMode]);

  // Create a folder lookup map
  const folderMap = useMemo(() => {
    const map = {};
    folders.forEach(folder => {
      map[folder._id] = { name: folder.name, color: folder.color };
    });
    return map;
  }, [folders]);

  // Filter resources based on active tab
  const filteredResources = useMemo(() => {
    // First, exclude trashed resources
    const activeResources = resources.filter(r => !r.isTrashed);
    
    let filtered;
    switch (activeTab) {
      case 'All':
        // Sort by newest first for 'All' tab
        filtered = [...activeResources].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      
      case 'Recent':
        filtered = [...activeResources].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      
      case 'Uncategorised':
        // Sort uncategorised by newest first too
        filtered = activeResources
          .filter(resource => !resource.folderId || resource.tags.length === 0)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      
      case 'Favourite':
        // Sort favorites by newest first
        filtered = activeResources
          .filter(resource => resource.isFavorite)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      
      default:
        filtered = [...activeResources].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
    
    return filtered;
  }, [activeTab, resources]);

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedItems.includes(item._id);
    const isUncategorised = activeTab === 'Uncategorised';
    
    return (
      <View style={[isSelected && styles.selectedItemContainer]}>
        <LinkItem
          title={item.title}
          url={item.url}
          description={item.description}
          tags={item.tags}
          folder={item.folderName || (item.folderId ? folderMap[item.folderId] : null)}
          isFavorite={item.isFavorite}
          type={item.type}
          onPress={() => handleLinkPress(item)}
          onLongPress={isUncategorised ? () => handleLongPress(item) : undefined}
          onEdit={() => handleEdit(item)}
          onMoveToFolder={() => {
            setResourceToMove(item);
            setMoveToFolderSheetVisible(true);
          }}
          onDelete={() => handleDelete(item)}
          onToggleFavorite={() => handleToggleFavorite(item)}
        />
        {isSelected && (
          <View style={styles.selectionCheckmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>
    );
  }, [handleLinkPress, handleLongPress, handleEdit, handleDelete, handleToggleFavorite, folderMap, selectedItems, activeTab]);

  const keyExtractor = useCallback((item) => item._id || item.id || String(item.url), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Global Header */}
      <Header
        onAccountPress={() => setAccountSheetVisible(true)}
        onMorePress={handleMorePress}
        onAutoOrganise={() => setAutoOrganiseSheetVisible(true)}
        activeTab={activeTab}
      />

      {/* Internal Tabs (filters, not navigation) */}
      <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Uncategorised Tab Header */}
      {/* {activeTab === 'Uncategorised' && !selectionMode && (
        <View style={styles.uncategorisedHeader}>
          <Text style={styles.uncategorisedTitle}>Uncategorised Items</Text>
          <Text style={styles.uncategorisedSubtitle}>
            Items without a folder or tags
          </Text>
        </View>
      )} */}

      {/* Selection Mode Header */}
      {selectionMode && activeTab === 'Uncategorised' && (
        <View style={[styles.selectionHeader, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
          <View style={styles.selectionLeft}>
            <Text style={[styles.selectionCount, { color: colors.textPrimary }]}>
              {selectedItems.length} selected
            </Text>
          </View>
          <View style={styles.selectionActions}>
            <Pressable 
              onPress={handleSelectAll}
              style={({ pressed }) => [
                styles.selectAllButton,
                { backgroundColor: colors.backgroundTertiary },
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={[styles.selectAllText, { color: colors.textPrimary }]}>Select All</Text>
            </Pressable>
            <Pressable 
              onPress={exitSelectionMode} 
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Link List */}
      <FlatList
        data={filteredResources}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={selectedItems}
        contentContainerStyle={styles.linkList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
        ListEmptyComponent={
          <EmptyState
            icon="link"
            title="No Links Yet"
            message="Start adding links to see them here"
          />
        }
      />

      <AccountSheet 
        visible={accountSheetVisible}
        onClose={() => setAccountSheetVisible(false)}
        user={user}
      />

      <PreviewResourceModal
      
      visible={previewModalVisible}
      onClose={() => setPreviewModalVisible(false)}
      resource={previewResource}
      onEdit={() => {
        setPreviewModalVisible(false);
        setTimeout(() => handleEdit(previewResource), 300);
      }}
      onDelete={() => {
        setPreviewModalVisible(false);
        handleDelete(previewResource);
      }}
      onToggleFavorite={() => {
        setPreviewModalVisible(false);
        handleToggleFavorite(previewResource);
      }}
      />

      <EditResourceModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedResource(null);
        }}
        resource={selectedResource}
        onSave={handleSaveEdit}
      />

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

      <AutoOrganiseSheet
        visible={autoOrganiseSheetVisible}
        onClose={() => setAutoOrganiseSheetVisible(false)}
        onOrganise={handleAutoOrganise}
        selectedCount={selectedItems.length}
        totalUncategorised={filteredResources.filter(r => 
          !r.folderId || r.tags.length === 0
        ).length}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linkList: {
    padding: 12,
    paddingBottom: 32,
  },
  uncategorisedHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  uncategorisedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  uncategorisedSubtitle: {
    fontSize: 13,
  },
  selectedItemContainer: {
    position: 'relative',
  },
  selectionCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectionLeft: {
    flex: 1,
  },
  selectAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '500',
  },
  deleteText: {
    color: '#EF4444',
  },
});
