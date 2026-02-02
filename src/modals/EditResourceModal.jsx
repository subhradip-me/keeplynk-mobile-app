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
  Image,
} from 'react-native';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function EditResourceModal({ visible, onClose, resource, onSave }) {
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

  const getFavicon = (url) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

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
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Resource</Text>
          </View>

          {/* Form */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* URL Section */}
            <View style={styles.section}>
              <Text style={styles.label}>URL</Text>
              <View style={styles.urlContainer}>
                <Icon name="link" size={18} color="#666" />
                <Text style={styles.urlText} numberOfLines={2}>
                  {url}
                </Text>
              </View>
            </View>

            {/* Title Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a description (optional)"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Folder Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Folder</Text>
              <Pressable 
                style={styles.folderSelector}
                onPress={() => setFolderExpanded(!folderExpanded)}
              >
                <Icon name="folder-open" size={20} color="#666" />
                <Text style={styles.folderText}>
                  {folders.find(f => (f._id || f.id) === selectedFolderId)?.name || 'Uncategorised'}
                </Text>
                <Icon 
                  name={folderExpanded ? "expand-less" : "expand-more"} 
                  size={20} 
                  color="#999" 
                />
              </Pressable>
              
              {/* Expanded Folder List */}
              {folderExpanded && (
                <View style={styles.folderList}>
                  {/* Uncategorised Option */}
                  <Pressable
                    style={[styles.folderItem, selectedFolderId === null && styles.folderItemSelected]}
                    onPress={() => {
                      setSelectedFolderId(null);
                      setFolderExpanded(false);
                    }}
                  >
                    <View style={[styles.folderIconContainer, { backgroundColor: '#E5E7EB' }]}>
                      <Icon name="folder-open" size={16} color="#6B7280" />
                    </View>
                    <Text style={styles.folderItemText}>Uncategorised</Text>
                    {selectedFolderId === null && (
                      <Icon name="check" size={18} color="#2563EB" />
                    )}
                  </Pressable>
                  
                  {/* Folder Items */}
                  {folders.map((folder) => {
                    const isSelected = selectedFolderId === (folder._id || folder.id);
                    return (
                      <Pressable
                        key={folder._id || folder.id}
                        style={[styles.folderItem, isSelected && styles.folderItemSelected]}
                        onPress={() => {
                          setSelectedFolderId(folder._id || folder.id);
                          setFolderExpanded(false);
                        }}
                      >
                        <View 
                          style={[
                            styles.folderIconContainer,
                            { backgroundColor: folder.color ? `${folder.color}15` : '#F3F4F6' }
                          ]}
                        >
                          <Icon 
                            name={folder.icon || 'folder'} 
                            size={16} 
                            color={folder.color || '#6B7280'} 
                          />
                        </View>
                        <Text style={styles.folderItemText}>{folder.name}</Text>
                        {isSelected && (
                          <Icon name="check" size={18} color="#2563EB" />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Tags Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Tags</Text>
              <TextInput
                style={styles.input}
                placeholder="Add tags separated by commas"
                placeholderTextColor="#999"
                value={tags}
                onChangeText={setTags}
              />
              <Text style={styles.hint}>Example: design, inspiration, ui</Text>
            </View>
          </ScrollView>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              (!url.trim() || !hasChanges()) && styles.saveButtonDisabled,
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={!url.trim() || !hasChanges()}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: '92%',
  },
  handleBar: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37352F',
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
    color: '#333',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000000ff',
  },
  inputReadOnly: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  folderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  folderText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  folderList: {
    marginTop: 8,
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
    borderBottomColor: '#F4F4F5',
  },
  folderItemSelected: {
    backgroundColor: '#F0F9FF',
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
    color: '#37352F',
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#000000ff',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#8d8d8dff',
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
});