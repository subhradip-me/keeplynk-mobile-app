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
                Restore all {trashedResources.length} items from trash?
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
                Permanently delete all {trashedResources.length} items?
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
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
});
