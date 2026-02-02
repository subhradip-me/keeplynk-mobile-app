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
import { useAuth } from '../features/auth/authHooks';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const { resources, fetchResources } = useResources();
  const { folders, fetchFolders } = useFolders();
  const [activeTab, setActiveTab] = useState('All');
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);

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

  const handleEdit = useCallback((resource) => {
    setSelectedResource(resource);
    setEditModalVisible(true);
  }, []);

  const handleSaveEdit = useCallback((updatedResource) => {
    console.log('Save edited resource:', updatedResource);
    // TODO: Dispatch update action
    setEditModalVisible(false);
    setSelectedResource(null);
  }, []);

  const handlePreview = useCallback((resource) => {
    setPreviewResource(resource);
    setPreviewModalVisible(true);
  }, []);

  const handleDelete = useCallback((resource) => {
    console.log('Delete resource:', resource);
    // TODO: Dispatch delete action
  }, []);

  const handleToggleFavorite = useCallback((resource) => {
    console.log('Toggle favorite:', resource);
    // TODO: Dispatch toggle favorite action
  }, []);

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
    switch (activeTab) {
      case 'All':
        return resources;
      
      case 'Recent':
        return [...resources].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      
      case 'Uncategorised':
        return resources.filter(
          resource => !resource.folderId || resource.tags.length === 0
        );
      
      case 'Favourite':
        return resources.filter(resource => resource.isFavorite);
      
      default:
        return resources;
    }
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
        />
        {isSelected && (
          <View style={styles.selectionCheckmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>
    );
  }, [handleLinkPress, handleLongPress, handleEdit, folderMap, selectedItems, activeTab]);

  const keyExtractor = useCallback((item) => item._id || item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Global Header */}
      <Header
        onAccountPress={() => setAccountSheetVisible(true)}
        onMorePress={handleMorePress}
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
        <View style={styles.selectionHeader}>
          
          <Text style={styles.selectionCount}>
            {selectedItems.length} selected
          </Text>
          <View style={styles.selectionActions}>
            <Pressable onPress={exitSelectionMode}>
              <LinearGradient
                colors={['#FFD700', '#FDB931', '#E5E4E2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.autoOrganiseButton}
              >
                <Text style={styles.autoOrganiseText}>✨ Auto Organise</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={exitSelectionMode} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

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
    </SafeAreaView>
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
  uncategorisedHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
  },
  uncategorisedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37352F',
    marginBottom: 4,
  },
  uncategorisedSubtitle: {
    fontSize: 13,
    color: '#787774',
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F7F6F3',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#37352F',
    fontWeight: '500',
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37352F',
    letterSpacing: -0.2,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  autoOrganiseButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  autoOrganiseText: {
    fontSize: 14,
    color: '#37352F',
    fontWeight: '700',
    letterSpacing: 0.3,
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
