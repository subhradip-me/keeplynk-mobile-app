import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useResources } from '../features/resources/resourceHooks';
import { makeResourceFavorite } from '../features/resources/resourceThunk';
import { useDispatch } from 'react-redux';
import LinkItem from '../components/LinkItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditResourceModal from '../modals/EditResourceModal';
import MoveToFolderSheet from '../modals/MoveToFolderSheet';

export default function FolderDetailScreen({ route = { params: { folder: { _id: '1', name: 'Sample Folder' } } } }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { folder } = route.params;
  const { resources = [], updateResource, deleteResource } = useResources();

  // Get resources by folder
  const folderResources = resources.filter(r => r.folderId === folder._id);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [moveToFolderSheetVisible, setMoveToFolderSheetVisible] = useState(false);
  const [resourceToMove, setResourceToMove] = useState(null);

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (updatedResource) => {
    try {
      await updateResource(selectedResource._id, updatedResource);
      setEditModalVisible(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Failed to update resource:', error);
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
      await deleteResource(resource._id);
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const handleMoveToFolder = async (folderId) => {
    if (!resourceToMove) return;
    
    try {
      await updateResource(resourceToMove._id, { folderId });
      setMoveToFolderSheetVisible(false);
      setResourceToMove(null);
    } catch (error) {
      console.error('Failed to move resource:', error);
    }
  };

  const menuItems = [
    { icon: 'edit', label: 'Edit Folder', action: () => console.log('Edit Folder') },
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#37352F" />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.folderIcon}>
            <Icon name={folder.icon || "folder"} size={24} color={folder.color || '#3B82F6'} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.folderName}>{folder.name}</Text>
            <Text style={styles.itemCount}>{folderResources.length} items</Text>
          </View>
        </View>
        <Pressable onPress={() => setModalVisible(true)} style={styles.moreButton}>
          <Icon name="more-vert" size={24} color="#37352F" />
        </Pressable>
      </View>

      {/* Description */}
      {folder.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{folder.description}</Text>
          <Text style={styles.createdDate}>Created {formatDate(folder.createdAt)}</Text>
        </View>
      )}

      {/* Resources List */}
      {folderResources.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="folder-open" size={64} color="#9B9A97" />
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptyMessage}>Add bookmarks and links to this folder</Text>
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
                onPress={() => handleLinkPress(resource)}
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
            <View style={styles.modalContent}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
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
                    color={item.danger ? '#EF4444' : '#37352F'}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      item.danger && styles.menuItemTextDanger
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
  folderIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F7F6F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  folderName: {
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
  moreButton: {
    padding: 4,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
  },
  description: {
    fontSize: 14,
    color: '#37352F',
    lineHeight: 20,
    marginBottom: 6,
  },
  createdDate: {
    fontSize: 12,
    color: '#9B9A97',
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
    color: '#37352F',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#787774',
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
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 180,
    shadowColor: '#000000ff',
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
    backgroundColor: '#F7F6F3',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    color: '#37352F',
    fontWeight: '400',
  },
  menuItemTextDanger: {
    color: '#EF4444',
  },
});