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
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function EditResourceModal({ visible, onClose, resource, onSave }) {
  const { updateResource } = useResources();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [tags, setTags] = useState('');
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  // Update form when resource changes
  useEffect(() => {
    if (resource) {
      setUrl(resource.url || '');
      setTitle(resource.title || '');
      setSelectedFolder(resource.folder || '');
      // Handle tags whether they're strings or objects with name property
      const tagString = resource.tags?.map(tag => typeof tag === 'object' ? tag.name : tag).join(', ') || '';
      setTags(tagString);
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

  const handleSave = async () => {
    if (!url.trim()) {
      console.log('URL is required');
      return;
    }

    const resourceData = {
      url: url.trim(),
      title: title.trim() || 'Untitled',
      folder: selectedFolder || 'Uncategorised',
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
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* URL Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URL *</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com"
                placeholderTextColor="#999"
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Folder Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Folder</Text>
              <Pressable style={styles.folderSelector}>
                <Icon name="folder-open" size={20} color="#666" />
                <Text style={styles.folderText}>
                  {selectedFolder || 'Select folder'}
                </Text>
                <Icon name="chevron-right" size={20} color="#999" />
              </Pressable>
            </View>

            {/* Tags Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tags (Optional)</Text>
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
              (!url.trim()) && styles.saveButtonDisabled,
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={!url.trim()}
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
    maxHeight: '90%',
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
  form: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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