import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFolders } from '../features/folders';
import NewFolderModal from '../modals/NewFolderModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FoldersScreen() {
  const navigation = useNavigation();
  const { folders, fetchFolders, createFolder } = useFolders();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const menuItems = [
    { icon: 'add', label: 'New Folder', action: () => setNewFolderModalVisible(true) },
    { icon: 'search', label: 'Sort By', action: () => console.log('Sort By') },
    { icon: 'more-vert', label: 'Settings', action: () => console.log('Settings') },
  ];

  const handleMorePress = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleSaveFolder = useCallback(async (folder) => {
    try {
      await createFolder({
        name: folder.name,
        description: folder.description,
        color: folder.color,
        icon: folder.icon,
        isPrivate: false,
      });
      setNewFolderModalVisible(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  }, [createFolder]);

  const handleFolderPress = useCallback((folder) => {
    navigation.navigate('FolderDetail', { folder });
  }, [navigation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderFolderItem = ({ item }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.folderItem,
        pressed && styles.folderItemPressed
      ]}
      onPress={() => handleFolderPress(item)}
    >
      <View style={styles.iconContainer}>
        <Icon name="folder-open" size={20} color = {item.color || '#787774'} />
      </View>
      
      <View style={styles.folderContent}>
        <Text style={styles.folderName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.description ? (
          <Text style={styles.folderDescription} numberOfLines={1}>
            {item.description}
          </Text>
        ) : (
          <Text style={styles.folderDescription} numberOfLines={1}>
            No description available
          </Text>
        )}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.itemCount} items</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      <Icon name="chevron-right" size={20} color="#9B9A97" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Folders</Text>
        <Pressable 
          onPress={handleMorePress}
          style={styles.moreButton}>
          <Icon name="more-horiz" size={20} color="#37352F" />
        </Pressable>
      </View>

      {/* Folder List */}
      <FlatList
        data={folders}
        keyExtractor={(item) => item._id}
        renderItem={renderFolderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
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
                  <Icon name={item.icon} size={20} color="#37352F" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* New Folder Modal */}
      <NewFolderModal
        visible={newFolderModalVisible}
        onClose={() => setNewFolderModalVisible(false)}
        onSave={handleSaveFolder}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#585858ff',
    letterSpacing: -0.4,
  },
  moreButton: {
    padding: 4,
    borderRadius: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#EBEBEA',
  },
  folderItemPressed: {
    backgroundColor: '#F7F6F3',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F7F6F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  folderContent: {
    flex: 1,
    gap: 2,
  },
  folderName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#37352F',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  folderDescription: {
    fontSize: 13,
    color: '#787774',
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#9B9A97',
  },
  metaDot: {
    fontSize: 12,
    color: '#9B9A97',
  },
  modalOverlay: {
    flex: 1,
   // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    position: 'absolute',
    top: 48,
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
});
