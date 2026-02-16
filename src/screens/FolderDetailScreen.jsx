import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders';
import { useTheme } from '../features/theme';
import { makeResourceFavorite, moveResourceToTrash, fetchResources } from '../features/resources/resourceThunk';
import { fetchFolders } from '../features/folders/folderThunk';
import { autoOrganizeResources } from '../features/organise';
import { useDispatch } from 'react-redux';
import LinkItem from '../components/LinkItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PreviewResourceModal from '../modals/PreviewResourceModal';
import EditResourceModal from '../modals/EditResourceModal';
import EditFolderModal from '../modals/EditFolderModal';
import MoveToFolderSheet from '../modals/MoveToFolderSheet';
import AutoOrganiseSheet from '../modals/AutoOrganiseSheet';

export default function FolderDetailScreen({ route = { params: { folder: { _id: '1', name: 'Sample Folder' } } } }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { folder: routeFolder } = route.params;
  const { resources = [], updateResource } = useResources();
  const { folders, updateFolder: updateFolderAction } = useFolders();

  // Get the live folder from Redux state for real-time updates
  const folder = folders.find(f => f._id === routeFolder._id) || routeFolder;

  // Get resources by folder (excluding trashed)
  const folderResources = resources.filter(r => r.folderId === folder._id && !r.isTrashed);

  const [modalVisible, setModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [moveToFolderSheetVisible, setMoveToFolderSheetVisible] = useState(false);
  const [resourceToMove, setResourceToMove] = useState(null);
  const [editFolderModalVisible, setEditFolderModalVisible] = useState(false);
  const [autoOrganiseSheetVisible, setAutoOrganiseSheetVisible] = useState(false);



  const handleAutoOrganise = async () => {
    // Validate that there are items to organize in this folder
    if (folderResources.length === 0) {
      console.log('No items in folder to organize');
      return;
    }

    try {
      // Call the auto-organize API with a limit of 50 resources
      await dispatch(autoOrganizeResources(10)).unwrap();
      
      console.log('Auto organize completed successfully');
      
      // Refetch resources and folders after auto-organize
      await dispatch(fetchResources()).unwrap();
      await dispatch(fetchFolders()).unwrap();
      
      // Additional refresh after a short delay to ensure backend processing is complete
      setTimeout(async () => {
        dispatch(fetchResources());
        dispatch(fetchFolders());
      }, 2000);
      
    } catch (error) {
      console.error('Failed to auto organize:', error);
      // You might want to show an alert or toast here
      throw error;
    }
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (updatedResource) => {
    try {
      await updateResource(selectedResource._id, updatedResource);
      // Auto-refresh resources after update
      await dispatch(fetchResources());
      setEditModalVisible(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Failed to update resource:', error);
      throw error;
    }
  };

  const handleToggleFavorite = async (resource) => {
    try {
      await dispatch(makeResourceFavorite({ id: resource._id, isFavorite: resource.isFavorite })).unwrap();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDelete = async (resource) => {
    try {
      await dispatch(moveResourceToTrash(resource._id)).unwrap();
      // Silently refetch in background to get properly populated tags
      dispatch(fetchResources());
    } catch (error) {
      console.error('Failed to move resource to trash:', error);
    }
  };

  const handleMoveToFolder = async (folderId) => {
    if (!resourceToMove) return;

    try {
      await updateResource(resourceToMove._id, { folderId });
      // Auto-refresh resources after moving
      await dispatch(fetchResources());
      setMoveToFolderSheetVisible(false);
      setResourceToMove(null);
    } catch (error) {
      console.error('Failed to move resource:', error);
      throw error;
    }
  };

  const handleSaveFolder = async (updatedFolder) => {
    try {
      await updateFolderAction(folder._id, updatedFolder).unwrap();
      setEditFolderModalVisible(false);
      // Update will trigger re-render through Redux
    } catch (error) {
      console.error('Failed to update folder:', error);
      throw error; // Re-throw so modal can show error
    }
  };

  const menuItems = [
    { icon: 'edit', label: 'Edit Folder', action: () => setEditFolderModalVisible(true) },
    { icon: 'share', label: 'Share', action: () => console.log('Share') },
    { icon: 'delete', label: 'Delete Folder', action: () => console.log('Delete Folder'), danger: true },
  ];

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLinkPress = (resource) => {
    console.log('Resource pressed:', resource);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={[styles.folderIcon, { backgroundColor: colors.backgroundTertiary }]}>
            <Icon name={folder.icon || "folder"} size={24} color={folder.color || colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.folderName, { color: colors.textPrimary }]}>{folder.name}</Text>
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>{folderResources.length} items</Text>
          </View>
        </View>
        {(folder.name === 'Uncategorised' || folder.name === 'Uncategorized') && folderResources.length > 0 && (
          <Pressable onPress={() => setAutoOrganiseSheetVisible(true)} style={styles.moreButton}>
            <Icon name="smart-toy" size={24} color={colors.textPrimary} />
          </Pressable>
        )}
        <Pressable onPress={() => setModalVisible(true)} style={styles.moreButton}>
          <Icon name="more-vert" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Description */}
      {folder.description && (
        <View style={[styles.descriptionContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.description, { color: colors.textPrimary }]}>{folder.description}</Text>
          <Text style={[styles.createdDate, { color: colors.textTertiary }]}>Created {formatDate(folder.createdAt)}</Text>
        </View>
      )}

      {/* Resources List */}
      {folderResources.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="folder-open" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No items yet</Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>Add bookmarks and links to this folder</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.linkList}>
            {folderResources.map((resource) => (
              <LinkItem
                key={resource._id}
                title={resource.title}
                url={resource.url}
                description={resource.description}
                tags={resource.tags}
                folder={resource.folderName}
                isFavorite={resource.isFavorite}
                type={resource.type}
                onPress={() => setSelectedResource(resource) || setPreviewModalVisible(true)}
                onEdit={() => handleEdit(resource)}
                onMoveToFolder={() => {
                  setResourceToMove(resource);
                  setMoveToFolderSheetVisible(true);
                }}
                onToggleFavorite={() => handleToggleFavorite(resource)}
                onDelete={() => handleDelete(resource)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Options Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.backgroundTertiary }]}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: colors.surfaceHover },
                    index === menuItems.length - 1 && styles.menuItemLast
                  ]}
                  onPress={() => {
                    item.action();
                    closeModal();
                  }}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color={item.danger ? colors.error : colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      { color: colors.textPrimary },
                      item.danger && { color: colors.error }
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <PreviewResourceModal
        visible={previewModalVisible}
        resource={selectedResource}
        onClose={() => {
          setPreviewModalVisible(false);
          setSelectedResource(null);
        }}
        onEdit={() => {
          setPreviewModalVisible(false);
          setTimeout(() => handleEdit(selectedResource), 300);
        }}
        onDelete={() => {
          setPreviewModalVisible(false);
          handleDelete(selectedResource);
        }}
        onToggleFavorite={() => {
          setPreviewModalVisible(false);
          handleToggleFavorite(selectedResource);
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

      <EditFolderModal
        visible={editFolderModalVisible}
        onClose={() => setEditFolderModalVisible(false)}
        onSave={handleSaveFolder}
        folder={folder}
      />

      <AutoOrganiseSheet
        visible={autoOrganiseSheetVisible}
        onClose={() => setAutoOrganiseSheetVisible(false)}
        onOrganise={handleAutoOrganise}
        folderId={folder._id}
        totalUncategorised={folderResources.length}
      />
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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  folderIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  itemCount: {
    fontSize: 13,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  createdDate: {
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  linkList: {
    padding: 12,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    top: 56,
    right: 16,
  },
  modalContent: {
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemPressed: {
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '400',
  },
  menuItemTextDanger: {
  },
});