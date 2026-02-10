import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../features/theme';
import LinkItem from '../components/LinkItem';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';
import { restoreResourceFromTrash, deleteResource, fetchResources } from '../features/resources/resourceThunk';

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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { resources = [] } = useResources();
  const { folders } = useFolders();
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreAllModal, setShowRestoreAllModal] = useState(false);
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  
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
    setSelectedResource(resource);
    setShowRestoreModal(true);
  }, []);

  const confirmRestore = useCallback(async () => {
    if (!selectedResource) return;
    
    setShowRestoreModal(false);
    try {
      await dispatch(restoreResourceFromTrash(selectedResource._id)).unwrap();
      dispatch(fetchResources());
    } catch (error) {
      Alert.alert('Error', 'Failed to restore resource');
      console.error('Failed to restore resource:', error);
    }
    setSelectedResource(null);
  }, [dispatch, selectedResource]);

  const handlePermanentDelete = useCallback(async (resource) => {
    setSelectedResource(resource);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedResource) return;
    
    setShowDeleteModal(false);
    try {
      await dispatch(deleteResource(selectedResource._id)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete resource');
      console.error('Failed to delete resource:', error);
    }
    setSelectedResource(null);
  }, [dispatch, selectedResource]);

  const handleEmptyTrash = useCallback(async () => {
    if (trashedResources.length === 0) return;
    setShowEmptyTrashModal(true);
  }, [trashedResources]);

  const confirmEmptyTrash = useCallback(async () => {
    setShowEmptyTrashModal(false);
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
  }, [trashedResources, dispatch]);

  const handleRestoreAll = useCallback(async () => {
    if (trashedResources.length === 0) return;
    setShowRestoreAllModal(true);
  }, [trashedResources]);

  const confirmRestoreAll = useCallback(async () => {
    setShowRestoreAllModal(false);
    try {
      await Promise.all(
        trashedResources.map(resource => 
          dispatch(restoreResourceFromTrash(resource._id)).unwrap()
        )
      );
      dispatch(fetchResources());
    } catch (error) {
      Alert.alert('Error', 'Failed to restore all resources');
      console.error('Failed to restore all resources:', error);
    }
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
      onRestore={() => handleRestore(item)} // Restore action
      onDelete={() => handlePermanentDelete(item)} // Permanent delete action
      // Disable other actions in trash
      onEdit={null}
      onMoveToFolder={null}
      onToggleFavorite={null}
      showOnlyTrashActions={true} // Flag to show only restore and delete actions
    />
  ), [handleRestore, handlePermanentDelete, folderMap]);

  const keyExtractor = useCallback((item) => item._id || item.id || String(item.url), []);

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
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>{trashedResources.length} items</Text>
          </View>
        </View>
        {trashedResources.length > 0 && (
          <Pressable 
            onPress={() => setShowActionsModal(true)}
            style={styles.moreButton}
          >
            <Icon name="more-vert" size={24} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>

      {/* Trash List */}
      {trashedResources.length === 0 ? (
        <EmptyState
          icon="delete-outline"
          title="Trash is Empty"
          message="Deleted items will appear here for 30 days before being permanently removed"
          colors={colors}
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

      {/* Actions Modal */}
      <Modal
        visible={showActionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowActionsModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Trash Actions</Text>
              <Pressable 
                onPress={() => setShowActionsModal(false)}
                style={[styles.modalCloseButton, { backgroundColor: colors.backgroundTertiary }]}
              >
                <Icon name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <Pressable
                style={[styles.modalOption, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => {
                  setShowActionsModal(false);
                  handleRestoreAll();
                }}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="restore" size={24} color={colors.primary} />
                </View>
                <View style={styles.modalOptionContent}>
                  <Text style={[styles.modalOptionText, { color: colors.textPrimary }]}>Restore All Items</Text>
                  <Text style={[styles.modalOptionSubtext, { color: colors.textSecondary }]}>Move all items back to their original folders</Text>
                </View>
              </Pressable>

              <Pressable
                style={[styles.modalOption, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => {
                  setShowActionsModal(false);
                  handleEmptyTrash();
                }}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: colors.error + '15' }]}>
                  <Icon name="delete-forever" size={24} color={colors.error} />
                </View>
                <View style={styles.modalOptionContent}>
                  <Text style={[styles.modalOptionText, { color: colors.textPrimary }]}>Empty Trash</Text>
                  <Text style={[styles.modalOptionSubtext, { color: colors.textSecondary }]}>Permanently delete all items (cannot be undone)</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
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
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => {
              setShowRestoreModal(false);
              setSelectedResource(null);
            }}
          />
          <View style={[styles.confirmationModal, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <View style={styles.confirmationHeader}>
              <View style={[styles.confirmationIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="restore" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.confirmationTitle, { color: colors.textPrimary }]}>Restore Item</Text>
              <Text style={[styles.confirmationMessage, { color: colors.textSecondary }]}>
                Restore "{selectedResource?.title}" from trash? It will be moved back to its original folder.
              </Text>
            </View>
            
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.backgroundTertiary }]}
                onPress={() => {
                  setShowRestoreModal(false);
                  setSelectedResource(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                onPress={confirmRestore}
              >
                <Icon name="restore" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Restore</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => {
              setShowDeleteModal(false);
              setSelectedResource(null);
            }}
          />
          <View style={[styles.confirmationModal, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <View style={styles.confirmationHeader}>
              <View style={[styles.confirmationIcon, { backgroundColor: colors.error + '15' }]}>
                <Icon name="delete-forever" size={28} color={colors.error} />
              </View>
              <Text style={[styles.confirmationTitle, { color: colors.textPrimary }]}>Delete Permanently</Text>
              <Text style={[styles.confirmationMessage, { color: colors.textSecondary }]}>
                Permanently delete "{selectedResource?.title}"? This action cannot be undone.
              </Text>
            </View>
            
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.backgroundTertiary }]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setSelectedResource(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.dangerButton, { backgroundColor: colors.error }]}
                onPress={confirmDelete}
              >
                <Icon name="delete-forever" size={18} color="#FFFFFF" />
                <Text style={styles.dangerButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Restore All Confirmation Modal */}
      <Modal
        visible={showRestoreAllModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRestoreAllModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowRestoreAllModal(false)}
          />
          <View style={[styles.confirmationModal, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <View style={styles.confirmationHeader}>
              <View style={[styles.confirmationIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="restore" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.confirmationTitle, { color: colors.textPrimary }]}>Restore All Items</Text>
              <Text style={[styles.confirmationMessage, { color: colors.textSecondary }]}>
                Restore all {trashedResources.length} items from trash? They will be moved back to their original folders.
              </Text>
            </View>
            
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.backgroundTertiary }]}
                onPress={() => setShowRestoreAllModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                onPress={confirmRestoreAll}
              >
                <Icon name="restore" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Restore All</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Empty Trash Confirmation Modal */}
      <Modal
        visible={showEmptyTrashModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEmptyTrashModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowEmptyTrashModal(false)}
          />
          <View style={[styles.confirmationModal, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <View style={styles.confirmationHeader}>
              <View style={[styles.confirmationIcon, { backgroundColor: colors.error + '15' }]}>
                <Icon name="delete-forever" size={28} color={colors.error} />
              </View>
              <Text style={[styles.confirmationTitle, { color: colors.textPrimary }]}>Empty Trash</Text>
              <Text style={[styles.confirmationMessage, { color: colors.textSecondary }]}>
                Permanently delete all {trashedResources.length} items? This action cannot be undone.
              </Text>
            </View>
            
            <View style={styles.confirmationActions}>
              <Pressable
                style={[styles.confirmationButton, styles.cancelButton, { backgroundColor: colors.backgroundTertiary }]}
                onPress={() => setShowEmptyTrashModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmationButton, styles.dangerButton, { backgroundColor: colors.error }]}
                onPress={confirmEmptyTrash}
              >
                <Icon name="delete-forever" size={18} color="#FFFFFF" />
                <Text style={styles.dangerButtonText}>Empty Trash</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
  backButton: {
    padding: 4,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 16,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  modalOptionSubtext: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 16,
  },
  confirmationModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  confirmationMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    // backgroundColor handled by colors
  },
  primaryButton: {
    flexDirection: 'row',
    gap: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    gap: 8,
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
});
