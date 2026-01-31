import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';

// Simple icon component
const Icon = ({ name, size = 24, color = '#000' }) => {
  const iconMap = {
    'close': '✕',
    'check': '✓',
    'link': '🔗',
    'add': '➕',
    'folder': '📁',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '?'}
    </Text>
  );
};

export default function AddResourceModal({ visible, onClose, onSave }) {
  const [resourceType, setResourceType] = useState('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const slideAnim = React.useRef(new Animated.Value(300)).current;

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

  const handleSave = () => {
    if (!url.trim()) {
      console.log('URL is required');
      return;
    }

    const resource = {
      url: url.trim(),
      title: title.trim() || 'Untitled',
      folder: selectedFolder || 'Uncategorised',
    };

    onSave?.(resource);
    
    // Clear form
    setUrl('');
    setTitle('');
    setSelectedFolder('');
    onClose();
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
            <Text style={styles.title}>Add Resource</Text>
          </View>

          {/* Type Toggle button */}
          <View style={styles.typeToggle}>
            <Pressable 
              style={[
                styles.typeToggleButton, 
                resourceType === 'url' && styles.typeToggleButtonActive
              ]}
              onPress={() => setResourceType('url')}
            >
              <Text style={[
                styles.typeToggleButtonText,
                resourceType === 'url' && styles.typeToggleButtonTextActive
              ]}>URL</Text>
            </Pressable>
            <Pressable 
              style={[
                styles.typeToggleButton,
                resourceType === 'file' && styles.typeToggleButtonActive
              ]}
              onPress={() => setResourceType('file')}
            >
              <Text style={[
                styles.typeToggleButtonText,
                resourceType === 'file' && styles.typeToggleButtonTextActive
              ]}>File</Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {resourceType === 'url' ? (
              <>
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
                  <Text style={styles.label}>Title (Optional)</Text>
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
              </>
            ) : (
              <>
                {/* File Upload Section */}
                <View style={styles.uploadSection}>
                  <Pressable style={styles.uploadBox}>
                    <Icon name="cloud-upload" size={48} color="#999" />
                    <Text style={styles.uploadTitle}>Upload File</Text>
                    <Text style={styles.uploadSubtitle}>
                      Tap to select files from your device
                    </Text>
                    <Text style={styles.uploadHint}>
                      PDF, Images, Documents supported
                    </Text>
                  </Pressable>
                </View>

                {/* File Name Input (if needed) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>File Name (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter file name"
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
              </>
            )}
          </View>

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
            <Text style={styles.saveButtonText}>Save Resource</Text>
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
  closeButton: {
    padding: 4,
  },

  typeToggle: {
    width: '60%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
    gap: 0,
    borderRadius: 22,
    padding: 4,
    backgroundColor: '#ffffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  typeToggleButton: {
    flex: 1,
    alignItems: 'center', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  typeToggleButtonActive: {
    backgroundColor: '#000000ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  typeToggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000ff',
  },
  typeToggleButtonTextActive: {
    color: '#ffffffff',
    fontWeight: '600',
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
  uploadSection: {
    marginBottom: 20,
  },
  uploadBox: {
    backgroundColor: '#ffffffff',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
