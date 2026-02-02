import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFolders } from '../features/folders/folderHooks';

export default function MoveToFolderSheet({ 
  visible, 
  onClose, 
  onMove, 
  currentFolderId,
  resourceTitle 
}) {
  const { folders } = useFolders();
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = React.useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 95,
        friction: 10,
      }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [visible, slideAnim]);

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMoveToFolder = (folderId) => {
    onMove?.(folderId);
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] }
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Move to Folder</Text>
          </View>

          {/* Resource Info */}
          {resourceTitle && (
            <View style={styles.resourceInfo}>
              <Icon name="link" size={16} color="#787774" />
              <Text style={styles.resourceTitle} numberOfLines={1}>
                {resourceTitle}
              </Text>
            </View>
          )}

          {/* Search */}
          {folders.length > 5 && (
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#9B9A97" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search folders..."
                placeholderTextColor="#9B9A97"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Icon name="cancel" size={18} color="#9B9A97" />
                </Pressable>
              )}
            </View>
          )}

          {/* Folders List */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Uncategorised Option */}
            <Pressable
              style={({ pressed }) => [
                styles.folderItem,
                currentFolderId === null && styles.folderItemActive,
                pressed && styles.folderItemPressed,
              ]}
              onPress={() => handleMoveToFolder(null)}
            >
              <View style={styles.folderLeft}>
                <View style={[styles.folderIconContainer, { backgroundColor: '#E5E7EB' }]}>
                  <Icon name="folder-open" size={20} color="#6B7280" />
                </View>
                <View style={styles.folderInfo}>
                  <Text style={styles.folderName}>Uncategorised</Text>
                  <Text style={styles.folderDescription}>No folder</Text>
                </View>
              </View>
              {currentFolderId === null && (
                <Icon name="check-circle" size={22} color="#2563EB" />
              )}
            </Pressable>

            {/* Folder List */}
            {filteredFolders.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="folder-off" size={48} color="#C5C4C0" />
                <Text style={styles.emptyStateText}>
                  {searchQuery ? 'No folders found' : 'No folders yet'}
                </Text>
              </View>
            ) : (
              filteredFolders.map((folder) => {
                const isActive = currentFolderId === (folder._id || folder.id);
                return (
                  <Pressable
                    key={folder._id || folder.id}
                    style={({ pressed }) => [
                      styles.folderItem,
                      isActive && styles.folderItemActive,
                      pressed && styles.folderItemPressed,
                    ]}
                    onPress={() => handleMoveToFolder(folder._id || folder.id)}
                  >
                    <View style={styles.folderLeft}>
                      <View 
                        style={[
                          styles.folderIconContainer, 
                          { backgroundColor: folder.color ? `${folder.color}15` : '#F3F4F6' }
                        ]}
                      >
                        <Icon 
                          name={folder.icon || 'folder'} 
                          size={20} 
                          color={folder.color || '#6B7280'} 
                        />
                      </View>
                      <View style={styles.folderInfo}>
                        <Text style={styles.folderName}>{folder.name}</Text>
                        {folder.description && (
                          <Text style={styles.folderDescription} numberOfLines={1}>
                            {folder.description}
                          </Text>
                        )}
                      </View>
                    </View>
                    {isActive && (
                      <Icon name="check-circle" size={22} color="#2563EB" />
                    )}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#000000ff',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37352F',
    letterSpacing: -0.2,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  resourceTitle: {
    flex: 1,
    fontSize: 13,
    color: '#787774',
    letterSpacing: -0.1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#37352F',
    padding: 0,
  },
  scrollView: {
    maxHeight: 400,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffffff',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  folderItemActive: {
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  folderItemPressed: {
    opacity: 0.7,
  },
  folderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  folderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#37352F',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  folderDescription: {
    fontSize: 12,
    color: '#9B9A97',
    letterSpacing: -0.1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9B9A97',
    marginTop: 12,
    textAlign: 'center',
  },
});
