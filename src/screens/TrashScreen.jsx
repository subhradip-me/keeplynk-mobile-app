import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Modal, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../features/theme';
import LinkItem from '../components/LinkItem';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';

// Simple EmptyState component for trash
const EmptyState = ({ icon, title, message, colors }) => (
  <View style={styles.emptyStateContainer}>
    <Icon name={icon} size={80} color={colors.textDisabled} />
    <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>{title}</Text>
    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>{message}</Text>
  </View>
);

export default function TrashScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { resources = [], fetchResources, deleteResource: deleteResourceAction, restoreFromTrash: restoreResourceFromTrash } = useResources();
  const { folders, trashedFolders, fetchFolders, restoreFromTrash, permanentDelete, fetchTrashedFolders } = useFolders();
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreAllModal, setShowRestoreAllModal] = useState(false);
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);
  const [showFolderActionsModal, setShowFolderActionsModal] = useState(false);
  const [showRestoreFolderModal, setShowRestoreFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 100, right: 16 });
  const folderActionButtonRef = useRef(null);
  const windowHeight = Dimensions.get('window').height;
  
  // Initial data fetch on mount
  useEffect(() => {
    fetchResources();
    fetchTrashedFolders();
    fetchFolders(); // Fetch regular folders too for proper state sync
  }, [fetchResources, fetchTrashedFolders, fetchFolders]);
  
  // Real-time updates - refresh data when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data when screen comes into focus
      // This ensures real-time updates when items are moved to/from trash
      fetchResources();
      fetchTrashedFolders();
    });
    
    return unsubscribe;
  }, [navigation, fetchResources, fetchTrashedFolders]);
  
  // Create a folder lookup map
  const folderMap = useMemo(() => {
    const map = {};
    folders?.forEach(folder => {
      map[folder._id] = { name: folder.name, color: folder.color };
    });
    return map;
  }, [folders]);
  
  // Filter deleted resources with error handling
  const trashedResources = useMemo(() => {
    try {
      return resources?.filter(r => r?.isTrashed === true ) || [];
    } catch (error) {
      console.error('Error filtering trashed resources:', error);
      return [];
    }
  }, [resources]);

  // Debug: Log when trashedFolders changes
  useEffect(() => {
    console.log('TrashScreen - trashedFolders updated:', trashedFolders?.length || 0, 'folders');
  }, [trashedFolders]);

  const totalTrashedItems = (trashedResources?.length || 0) + (trashedFolders?.length || 0);

  // Combine trashed resources and folders for display with error handling
  const trashedItems = useMemo(() => {
    try {
      const safeFolders = trashedFolders || [];
      const combined = [
        ...safeFolders.map(folder => ({ ...folder, itemType: 'folder' })),
        ...(trashedResources?.map(resource => ({ ...resource, itemType: 'resource' })) || [])
      ];
      return combined.sort((a, b) => {
        try {
          const aDate = new Date(a.updatedAt || a.createdAt || 0);
          const bDate = new Date(b.updatedAt || b.createdAt || 0);
          return bDate - aDate;
        } catch (error) {
          console.error('Error sorting trashed items:', error);
          return 0;
        }
      });
    } catch (error) {
      console.error('Error combining trashed items:', error);
      return [];
    }
  }, [trashedFolders, trashedResources]);

  const handleRestore = useCallback(async (resource) => {
    setSelectedResource(resource);
    setShowRestoreModal(true);
  }, []);

  const handleRestoreFolder = useCallback(async (folder) => {
    setSelectedFolder(folder);
    setShowRestoreFolderModal(true);
  }, []);

  const confirmRestoreFolder = useCallback(async () => {
    if (!selectedFolder) return;
    
    setShowRestoreFolderModal(false);
    try {
      // Await and unwrap to ensure Redux state is fully updated
      const result = await restoreFromTrash(selectedFolder._id);
      console.log('Folder restored successfully:', result);
      setSelectedFolder(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to restore folder');
      console.error('Failed to restore folder:', error);
      setSelectedFolder(null);
    }
  }, [restoreFromTrash, selectedFolder]);

  const handlePermanentDeleteFolder = useCallback(async (folder) => {
    // Prevent permanent deletion of Uncategorised folder
    if (folder.name === 'Uncategorised' || folder.name === 'Uncategorized') {
      Alert.alert('Cannot Delete', 'The Uncategorised folder cannot be permanently deleted');
      return;
    }
    
    setSelectedFolder(folder);
    setShowDeleteFolderModal(true);
  }, []);

  const confirmDeleteFolder = useCallback(async () => {
    if (!selectedFolder) return;
    
    setShowDeleteFolderModal(false);
    try {
      const result = await permanentDelete(selectedFolder._id);
      console.log('Folder permanently deleted:', result);
      setSelectedFolder(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to permanently delete folder');
      console.error('Failed to permanently delete folder:', error);
      setSelectedFolder(null);
    }
  }, [permanentDelete, selectedFolder]);

  const handleFolderActions = useCallback((folder) => {
    setSelectedFolder(folder);
    setShowFolderActionsModal(true);
  }, []);

  const confirmRestore = useCallback(async () => {
    if (!selectedResource) return;
    
    setShowRestoreModal(false);
    try {
      await restoreResourceFromTrash(selectedResource._id);
      fetchResources();
    } catch (error) {
      Alert.alert('Error', 'Failed to restore resource');
      console.error('Failed to restore resource:', error);
    }
    setSelectedResource(null);
  }, [restoreResourceFromTrash, selectedResource, fetchResources]);

  const handlePermanentDelete = useCallback(async (resource) => {
    setSelectedResource(resource);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedResource) return;
    
    setShowDeleteModal(false);
    try {
      await deleteResourceAction(selectedResource._id);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete resource');
      console.error('Failed to delete resource:', error);
    }
    setSelectedResource(null);
  }, [deleteResourceAction, selectedResource]);

  const handleEmptyTrash = useCallback(async () => {
    if (totalTrashedItems === 0) return;
    setShowEmptyTrashModal(true);
  }, [totalTrashedItems]);

  const confirmEmptyTrash = useCallback(async () => {
    setShowEmptyTrashModal(false);
    try {
      const resourcePromises = trashedResources.map(resource => 
        deleteResourceAction(resource._id)
      );
      const folderPromises = (trashedFolders || []).map(folder => 
        permanentDelete(folder._id)
      );
      await Promise.all([...resourcePromises, ...folderPromises]);
      // Refresh data after deletion
      fetchResources();
      fetchTrashedFolders();
    } catch (error) {
      Alert.alert('Error', 'Failed to empty trash');
      console.error('Failed to empty trash:', error);
    }
  }, [trashedResources, trashedFolders, deleteResourceAction, permanentDelete, fetchResources, fetchTrashedFolders]);

  const handleRestoreAll = useCallback(async () => {
    if (totalTrashedItems === 0) return;
    setShowRestoreAllModal(true);
  }, [totalTrashedItems]);

  const confirmRestoreAll = useCallback(async () => {
    setShowRestoreAllModal(false);
    try {
      const resourcePromises = trashedResources.map(resource => 
        restoreResourceFromTrash(resource._id)
      );
      const folderPromises = (trashedFolders || []).map(folder => 
        restoreFromTrash(folder._id)
      );
      await Promise.all([...resourcePromises, ...folderPromises]);
      // Refresh data after restoration
      fetchResources();
      fetchTrashedFolders();
    } catch (error) {
      Alert.alert('Error', 'Failed to restore all items');
      console.error('Failed to restore all items:', error);
    }
  }, [trashedResources, trashedFolders, restoreResourceFromTrash, restoreFromTrash, fetchResources, fetchTrashedFolders]);

  const renderTrashItem = useCallback(({ item }) => {
    if (item.itemType === 'folder') {
      const isUncategorised = item.name === 'Uncategorised' || item.name === 'Uncategorized';
      
      return (
        <Pressable 
          style={({ pressed }) => [
            styles.folderItem,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { backgroundColor: colors.surfaceHover }
          ]}
          onPress={() => {}} // No navigation in trash
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.backgroundTertiary }]}>  
            <Icon name={item.icon || "folder"} size={20} color={item.color || colors.textSecondary} />
          </View>
          
          <View style={styles.folderContent}>
            <Text style={[styles.folderName, { color: colors.textPrimary }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.folderDescription, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.description || 'No description available'}
              {isUncategorised && ' • Cannot be permanently deleted'}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>Folder in trash</Text>
              <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>Deleted</Text>
            </View>
          </View>

          <Pressable
            ref={folderActionButtonRef}
            onPress={(e) => {
              e?.stopPropagation?.();
              folderActionButtonRef.current?.measureInWindow((x, y, width, height) => {
                const menuHeight = 140; // Approximate menu height
                const buttonPosition = y + height;
                const screenPosition = buttonPosition / windowHeight;
                
                // If button is in lower 75% of screen, position menu above
                if (screenPosition > 0.75) {
                  setMenuPosition({ 
                    top: y - menuHeight - 8,
                    right: 16 
                  });
                } else {
                  setMenuPosition({ 
                    top: y + height + 8,
                    right: 16 
                  });
                }
                handleFolderActions(item);
              });
            }}
            style={styles.folderActionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="more-vert" size={20} color={colors.textSecondary} />
          </Pressable>
        </Pressable>
      );
    }
    
    return (
      <LinkItem
        title={item.title}
        url={item.url}
        description={item.description}
        tags={item.tags}
        folder={item.folderName || (item.folderId ? folderMap[item.folderId] : null)}
        isFavorite={item.isFavorite}
        type={item.type}
        onPress={() => {}} // No action on press in trash
        onRestore={() => handleRestore(item)} // Restore action
        onDelete={() => handlePermanentDelete(item)} // Permanent delete action
        // Disable other actions in trash
        onEdit={null}
        onMoveToFolder={null}
        onToggleFavorite={null}
        showOnlyTrashActions={true} // Flag to show only restore and delete actions
      />
    );
  }, [handleRestore, handlePermanentDelete, handleFolderActions, folderMap, colors, windowHeight]);

  const keyExtractor = useCallback((item, index) => {
    try {
      if (!item) return `empty-${index}`;
      
      if (item.itemType === 'folder') {
        return `folder-${item._id || item.id || index}`;
      }
      return `resource-${item._id || item.id || item.url || index}`;
    } catch (error) {
      console.error('Error extracting key:', error);
      return `error-${index}-${Date.now()}`;
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchResources(),
        fetchTrashedFolders(),
        fetchFolders()
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchResources, fetchTrashedFolders, fetchFolders]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.trashIcon}>
            <Icon name="delete" size={24} color={colors.error} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Trash</Text>
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>{totalTrashedItems} items</Text>
          </View>
        </View>
        {trashedResources.length > 0 && (
          <Pressable 
            onPress={() => setShowActionsModal(true)}
            style={styles.moreButton}
          >
            <Icon name="more-vert" size={24} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Trash List */}
      {trashedItems.length === 0 ? (
        <EmptyState
          icon="delete-outline"
          title="Trash is Empty"
          message="Deleted items will appear here for 30 days before being permanently removed"
          colors={colors}
        />
      ) : (
        <FlatList
          data={trashedItems}
          renderItem={renderTrashItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      {/* Actions Modal */}
      <Modal
        visible={showActionsModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowActionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionsModal(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={[styles.dropdownContent, { backgroundColor: colors.backgroundTertiary, shadowColor: colors.shadow }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.dropdownOption,
                  pressed && { backgroundColor: colors.surfaceHover }
                ]}
                onPress={() => {
                  setShowActionsModal(false);
                  handleRestoreAll();
                }}
              >
                <Icon name="restore" size={20} color={colors.primary} />
                <Text style={[styles.dropdownOptionText, { color: colors.textPrimary }]}>Restore All Items</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.dropdownOption,
                  styles.dropdownOptionLast,
                  pressed && { backgroundColor: colors.surfaceHover }
                ]}
                onPress={() => {
                  setShowActionsModal(false);
                  handleEmptyTrash();
                }}
              >
                <Icon name="delete-forever" size={20} color={colors.error} />
                <Text style={[styles.dropdownOptionText, { color: colors.error }]}>Empty Trash</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        visible={showRestoreModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowRestoreModal(false);
          setSelectedResource(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowRestoreModal(false);
            setSelectedResource(null);
          }}
        >
          <View
            style={[styles.confirmationSheet, { backgroundColor: colors.backgroundTertiary }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

            {/* Header */}
            <View style={[styles.confirmationHeader, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.confirmationHeaderTitle, { color: colors.textPrimary }]}>Restore Item</Text>
            </View>

            {/* Content */}
            <View style={styles.confirmationContent}>
              <View style={[styles.confirmationIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="restore" size={32} color="#10B981" />
              </View>
              <Text style={[styles.confirmationMessage, { color: colors.textPrimary }]}>
                Restore "{selectedResource?.title}" from trash?
              </Text>
              <Text style={[styles.confirmationSubMessage, { color: colors.textSecondary }]}>
                It will be moved back to its original folder.
              </Text>
            </View>
            
            {/* Actions */}
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => {
                  setShowRestoreModal(false);
                  setSelectedResource(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.primaryButton]}
                onPress={confirmRestore}
              >
                <Icon name="restore" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Restore</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDeleteModal(false);
          setSelectedResource(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDeleteModal(false);
            setSelectedResource(null);
          }}
        >
          <View
            style={[styles.confirmationSheet, { backgroundColor: colors.backgroundTertiary }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

            {/* Header */}
            <View style={[styles.confirmationHeader, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.confirmationHeaderTitle, { color: colors.textPrimary }]}>Delete Permanently</Text>
            </View>

            {/* Content */}
            <View style={styles.confirmationContent}>
              <View style={[styles.confirmationIcon, { backgroundColor: '#FEF2F2' }]}>
                <Icon name="delete-forever" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.confirmationMessage, { color: colors.textPrimary }]}>
                Permanently delete "{selectedResource?.title}"?
              </Text>
              <Text style={[styles.confirmationSubMessage, { color: colors.textSecondary }]}>
                This action cannot be undone.
              </Text>
            </View>
            
            {/* Actions */}
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setSelectedResource(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.dangerButton]}
                onPress={confirmDelete}
              >
                <Icon name="delete-forever" size={18} color="#FFFFFF" />
                <Text style={styles.dangerButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Restore All Confirmation Modal */}
      <Modal
        visible={showRestoreAllModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRestoreAllModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRestoreAllModal(false)}
        >
          <View
            style={[styles.confirmationSheet, { backgroundColor: colors.backgroundTertiary }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

            {/* Header */}
            <View style={[styles.confirmationHeader, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.confirmationHeaderTitle, { color: colors.textPrimary }]}>Restore All Items</Text>
            </View>

            {/* Content */}
            <View style={styles.confirmationContent}>
              <View style={[styles.confirmationIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="restore" size={32} color="#10B981" />
              </View>
              <Text style={[styles.confirmationMessage, { color: colors.textPrimary }]}>
                Restore all {totalTrashedItems} items from trash?
              </Text>
              <Text style={[styles.confirmationSubMessage, { color: colors.textSecondary }]}>
                They will be moved back to their original folders.
              </Text>
            </View>
            
            {/* Actions */}
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setShowRestoreAllModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.primaryButton]}
                onPress={confirmRestoreAll}
              >
                <Icon name="restore" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Restore All</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Empty Trash Confirmation Modal */}
      <Modal
        visible={showEmptyTrashModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEmptyTrashModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEmptyTrashModal(false)}
        >
          <View
            style={[styles.confirmationSheet, { backgroundColor: colors.backgroundTertiary }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

            {/* Header */}
            <View style={[styles.confirmationHeader, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.confirmationHeaderTitle, { color: colors.textPrimary }]}>Empty Trash</Text>
            </View>

            {/* Content */}
            <View style={styles.confirmationContent}>
              <View style={[styles.confirmationIcon, { backgroundColor: '#FEF2F2' }]}>
                <Icon name="delete-forever" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.confirmationMessage, { color: colors.textPrimary }]}>
                Permanently delete all {totalTrashedItems} items?
              </Text>
              <Text style={[styles.confirmationSubMessage, { color: colors.textSecondary }]}>
                This action cannot be undone.
              </Text>
            </View>
            
            {/* Actions */}
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setShowEmptyTrashModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.dangerButton]}
                onPress={confirmEmptyTrash}
              >
                <Icon name="delete-forever" size={18} color="#FFFFFF" />
                <Text style={styles.dangerButtonText}>Empty Trash</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Folder Actions Modal */}
      <Modal
        visible={showFolderActionsModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowFolderActionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlayTransparent}
          activeOpacity={1}
          onPress={() => setShowFolderActionsModal(false)}
        >
          <View style={[styles.menuContainer, { top: menuPosition.top, right: menuPosition.right }]}>
            <View style={[styles.menuContent, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: colors.hover },
                  styles.menuItemFirst,
                ]}
                onPress={() => {
                  setShowFolderActionsModal(false);
                  handleRestoreFolder(selectedFolder);
                }}
              >
                <Icon name="restore" size={18} color={colors.textSecondary} />
                <Text style={[styles.menuItemText, { color: colors.textSecondary }]}>
                  Restore Folder
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: colors.hover },
                  styles.menuItemLast,
                ]}
                onPress={() => {
                  setShowFolderActionsModal(false);
                  handlePermanentDeleteFolder(selectedFolder);
                }}
                disabled={selectedFolder?.name === 'Uncategorised' || selectedFolder?.name === 'Uncategorized'}
              >
                <Icon 
                  name="delete-forever" 
                  size={18} 
                  color={
                    selectedFolder?.name === 'Uncategorised' || selectedFolder?.name === 'Uncategorized' 
                      ? colors.textDisabled 
                      : '#EF4444'
                  } 
                />
                <Text style={[
                  styles.menuItemText,
                  { color: colors.textSecondary },
                  !(selectedFolder?.name === 'Uncategorised' || selectedFolder?.name === 'Uncategorized') && styles.menuItemTextDanger
                ]}>
                  Delete Forever
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Restore Folder Confirmation Modal */}
      <Modal
        visible={showRestoreFolderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowRestoreFolderModal(false);
          setSelectedFolder(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowRestoreFolderModal(false);
            setSelectedFolder(null);
          }}
        >
          <View
            style={[styles.confirmationSheet, { backgroundColor: colors.backgroundTertiary }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

            {/* Header */}
            <View style={[styles.confirmationHeader, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.confirmationHeaderTitle, { color: colors.textPrimary }]}>Restore Folder</Text>
            </View>

            {/* Content */}
            <View style={styles.confirmationContent}>
              <View style={[styles.confirmationIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="restore" size={32} color="#10B981" />
              </View>
              <Text style={[styles.confirmationMessage, { color: colors.textPrimary }]}>
                Restore "{selectedFolder?.name}" from trash?
              </Text>
              <Text style={[styles.confirmationSubMessage, { color: colors.textSecondary }]}>
                The folder and all its contents will be restored.
              </Text>
            </View>
            
            {/* Actions */}
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => {
                  setShowRestoreFolderModal(false);
                  setSelectedFolder(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.primaryButton]}
                onPress={confirmRestoreFolder}
              >
                <Icon name="restore" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Restore</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Folder Confirmation Modal */}
      <Modal
        visible={showDeleteFolderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDeleteFolderModal(false);
          setSelectedFolder(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDeleteFolderModal(false);
            setSelectedFolder(null);
          }}
        >
          <View
            style={[styles.confirmationSheet, { backgroundColor: colors.backgroundTertiary }]}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

            {/* Header */}
            <View style={[styles.confirmationHeader, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.confirmationHeaderTitle, { color: colors.textPrimary }]}>Delete Forever</Text>
            </View>

            {/* Content */}
            <View style={styles.confirmationContent}>
              <View style={[styles.confirmationIcon, { backgroundColor: '#FEF2F2' }]}>
                <Icon name="delete-forever" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.confirmationMessage, { color: colors.textPrimary }]}>
                Permanently delete "{selectedFolder?.name}"?
              </Text>
              <Text style={[styles.confirmationSubMessage, { color: colors.textSecondary }]}>
                This folder and all its contents will be permanently deleted. This action cannot be undone.
              </Text>
            </View>
            
            {/* Actions */}
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => {
                  setShowDeleteFolderModal(false);
                  setSelectedFolder(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.dangerButton]}
                onPress={confirmDeleteFolder}
              >
                <Icon name="delete-forever" size={18} color="#FFFFFF" />
                <Text style={styles.dangerButtonText}>Delete Forever</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Info Banner */}
      {trashedResources.length > 0 && (
        <View style={[styles.infoBanner, { backgroundColor: colors.surfaceHover, borderTopColor: colors.border }]}>
          <Icon name="info-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoBannerText, { color: colors.textSecondary }]}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  moreButton: {
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
    letterSpacing: -0.3,
  },
  itemCount: {
    fontSize: 13,
    marginTop: 2,
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
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayTransparent: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
  },
  menuContent: {
    borderRadius: 8,
    minWidth: 192,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemFirst: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '400',
  },
  menuItemTextDanger: {
    color: '#EF4444',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 56,
    right: 16,
  },
  dropdownContent: {
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 180,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 15,
    fontWeight: '400',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  confirmationSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  confirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  confirmationHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  confirmationContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmationMessage: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  confirmationSubMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  folderContent: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  folderDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
  },
  metaDot: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  folderActionButton: {
    position: 'absolute',
     top: 12,
     right: 8,
     padding: 4,
  },
  // // Remove old folder styles
  // folderItemContent: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 12,
  // },
  // folderIcon: {
  //   width: 44,
  //   height: 44,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginRight: 12,
  // },
  // folderItemText: {
  //   flex: 1,
  // },
  // folderItemTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   marginBottom: 4,
  // },
  // folderItemDescription: {
  //   fontSize: 14,
  // },
  // folderItemActions: {
  //   flexDirection: 'row',
  //   gap: 8,
  // },
  // actionButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 6,
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  //   borderRadius: 8,
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  // actionButtonText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   color: '#ff0000ff',
  // },
});
