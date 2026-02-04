import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../features/theme';


export default function EditResourceModal({ visible, onClose, resource, onSave }) {
  const { colors } = useTheme();
  const { updateResource } = useResources();
  const { folders } = useFolders();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [tags, setTags] = useState('');
  const [folderExpanded, setFolderExpanded] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  // Update form when resource changes
  useEffect(() => {
    if (resource) {
      const urlValue = resource.url || '';
      const titleValue = resource.title || '';
      const descriptionValue = resource.description || '';
      const folderIdValue = resource.folderId || null;
      const tagString = resource.tags?.map(tag => typeof tag === 'object' ? tag.name : tag).join(', ') || '';
      
      setUrl(urlValue);
      setTitle(titleValue);
      setDescription(descriptionValue);
      setSelectedFolderId(folderIdValue);
      setTags(tagString);
      
      // Store original values for comparison
      setOriginalData({
        url: urlValue,
        title: titleValue,
        description: descriptionValue,
        folderId: folderIdValue,
        tags: tagString,
      });
    }
  }, [resource]);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 90,
        friction: 10,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim]);

  const hasChanges = () => {
    return (
      url !== originalData.url ||
      title !== originalData.title ||
      description !== originalData.description ||
      selectedFolderId !== originalData.folderId ||
      tags !== originalData.tags
    );
  };

  const handleSave = async () => {
    if (!url.trim()) {
      console.log('URL is required');
      return;
    }

    const resourceData = {
      url: url.trim(),
      title: title.trim() || 'Untitled',
      description: description.trim(),
      folderId: selectedFolderId,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      await updateResource(resource._id, resourceData);
      onSave?.(resourceData);
      onClose();
    } catch (error) {
      console.error('Failed to update resource:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.backgroundTertiary, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: colors.textPrimary }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Edit Resource</Text>
          </View>

          {/* Form */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* URL Section */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>URL</Text>
              <View style={[styles.urlContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Icon name="link" size={18} color={colors.textSecondary} />
                <Text style={[styles.urlText, { color: colors.textPrimary }]} numberOfLines={2}>
                  {url}
                </Text>
              </View>
            </View>

            {/* Title Section */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Title</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceHover, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Enter a title"
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description Section */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceHover, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Add a description (optional)"
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Folder Section */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Folder</Text>
              <Pressable 
                style={[styles.folderSelector, { backgroundColor: colors.surfaceHover, borderColor: colors.border }]}
                onPress={() => setFolderExpanded(!folderExpanded)}
              >
                <Icon name="folder-open" size={20} color={colors.textSecondary} />
                <Text style={[styles.folderText, { color: colors.textPrimary }]}>
                  {folders.find(f => (f._id || f.id) === selectedFolderId)?.name || 'Uncategorised'}
                </Text>
                <Icon 
                  name={folderExpanded ? "expand-less" : "expand-more"} 
                  size={20} 
                  color={colors.textTertiary} 
                />
              </Pressable>
              
              {/* Expanded Folder List */}
              {folderExpanded && (
                <View style={[styles.folderList, { backgroundColor: colors.surfaceHover, borderColor: colors.border }]}>
                  {/* Uncategorised Option */}
                  <Pressable
                    style={[styles.folderItem, { borderBottomColor: colors.borderLight }, selectedFolderId === null && [styles.folderItemSelected, { backgroundColor: colors.backgroundTertiary }]]}
                    onPress={() => {
                      setSelectedFolderId(null);
                      setFolderExpanded(false);
                    }}
                  >
                    <View style={[styles.folderIconContainer, { backgroundColor: colors.backgroundTertiary }]}>
                      <Icon name="folder-open" size={16} color={colors.textSecondary} />
                    </View>
                    <Text style={[styles.folderItemText, { color: colors.textPrimary }]}>Uncategorised</Text>
                    {selectedFolderId === null && (
                      <Icon name="check" size={18} color={colors.primary} />
                    )}
                  </Pressable>
                  
                  {/* Folder Items */}
                  {folders.map((folder) => {
                    const isSelected = selectedFolderId === (folder._id || folder.id);
                    return (
                      <Pressable
                        key={folder._id || folder.id}
                        style={[styles.folderItem, { borderBottomColor: colors.borderLight }, isSelected && [styles.folderItemSelected, { backgroundColor: colors.backgroundTertiary }]]}
                        onPress={() => {
                          setSelectedFolderId(folder._id || folder.id);
                          setFolderExpanded(false);
                        }}
                      >
                        <View 
                          style={[
                            styles.folderIconContainer,
                            { backgroundColor: folder.color ? `${folder.color}15` : colors.backgroundTertiary }
                          ]}
                        >
                          <Icon 
                            name={folder.icon || 'folder'} 
                            size={16} 
                            color={folder.color || colors.textSecondary} 
                          />
                        </View>
                        <Text style={[styles.folderItemText, { color: colors.textPrimary }]}>{folder.name}</Text>
                        {isSelected && (
                          <Icon name="check" size={18} color={colors.primary} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Tags Section */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Tags</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceHover, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Add tags separated by commas"
                placeholderTextColor={colors.textTertiary}
                value={tags}
                onChangeText={setTags}
              />
              <Text style={[styles.hint, { color: colors.textSecondary }]}>Example: design, inspiration, ui</Text>
            </View>
          </ScrollView>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.textPrimary },
              (!url.trim() || !hasChanges()) && [styles.saveButtonDisabled, { backgroundColor: colors.textTertiary }],
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={!url.trim() || !hasChanges()}
          >
            <Text style={[styles.saveButtonText, { color: colors.background }]}>Save Changes</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: '92%',
  },
  handleBar: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  inputReadOnly: {
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  folderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  folderText: {
    flex: 1,
    fontSize: 15,
  },
  folderList: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 250,
    overflow: 'hidden',
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  folderItemSelected: {
  },
  folderIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  saveButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
  },
  saveButtonDisabled: {
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});