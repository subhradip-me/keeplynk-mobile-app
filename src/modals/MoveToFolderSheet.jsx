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
import { useTheme } from '../features/theme';

export default function MoveToFolderSheet({ 
  visible, 
  onClose, 
  onMove, 
  currentFolderId,
  resourceTitle 
}) {
  const { colors } = useTheme();
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
            { backgroundColor: colors.backgroundTertiary, transform: [{ translateY: slideAnim }] }
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Move to Folder</Text>
          </View>

          {/* Resource Info */}
          {resourceTitle && (
            <View style={[styles.resourceInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name="link" size={16} color={colors.textSecondary} />
              <Text style={[styles.resourceTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {resourceTitle}
              </Text>
            </View>
          )}

          {/* Search */}
          {folders.length > 5 && (
            <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name="search" size={20} color={colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search folders..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Icon name="cancel" size={18} color={colors.textTertiary} />
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
            

            {/* Folder List */}
            {filteredFolders.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="folder-off" size={48} color={colors.textDisabled} />
                <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
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
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isActive && [styles.folderItemActive, { borderColor: colors.primary }],
                      pressed && styles.folderItemPressed,
                    ]}
                    onPress={() => handleMoveToFolder(folder._id || folder.id)}
                  >
                    <View style={styles.folderLeft}>
                      <View 
                        style={[
                          styles.folderIconContainer, 
                          { backgroundColor: folder.color ? `${folder.color}15` : colors.backgroundTertiary }
                        ]}
                      >
                        <Icon 
                          name={folder.icon || 'folder'} 
                          size={20} 
                          color={folder.color || colors.textSecondary} 
                        />
                      </View>
                      <View style={styles.folderInfo}>
                        <Text style={[styles.folderName, { color: colors.textPrimary }]}>{folder.name}</Text>
                        {folder.description && (
                          <Text style={[styles.folderDescription, { color: colors.textTertiary }]} numberOfLines={1}>
                            {folder.description}
                          </Text>
                        )}
                      </View>
                    </View>
                    {isActive && (
                      <Icon name="check-circle" size={22} color={colors.primary} />
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  handle: {
    width: 36,
    height: 4,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    borderRadius: 12,
    borderWidth: 1,
  },
  resourceTitle: {
    flex: 1,
    fontSize: 13,
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
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
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
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  folderItemActive: {
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
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  folderDescription: {
    fontSize: 12,
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
    marginTop: 12,
    textAlign: 'center',
  },
});
