import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import DocumentPicker from '@react-native-documents/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFolders } from '../features/folders/folderHooks';
import { useTheme } from '../features/theme';


export default function AddResourceModal({ visible, onClose, onSave }) {
  const { colors } = useTheme();
  const { folders } = useFolders();
  const [resourceType, setResourceType] = useState('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [folderExpanded, setFolderExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [resultMessage, setResultMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 90,
        friction: 10,
      }).start();
      setResult(null);
      setResultMessage('');
    } else {
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim]);
  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      if (result && result[0]) {
        const file = result[0];
        setSelectedFile(file);
        if (!title.trim()) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('File picker error:', err);
        Alert.alert('Error', 'Failed to pick file. Please try again.');
      }
    }
  };
  const handleSave = async () => {
    if (resourceType === 'url' && !url.trim()) {
      setResult('error');
      setResultMessage('URL is required');
      return;
    }

    if (resourceType === 'file' && !selectedFile) {
      setResult('error');
      setResultMessage('Please select a file');
      return;
    }

    setIsSaving(true);
    setResult(null);
    setResultMessage('');

    try {
      let resource;
      
      if (resourceType === 'url') {
        resource = {
          url: url.trim(),
          title: title.trim() || 'Untitled',
          folderId: selectedFolderId,
        };
      } else {
        resource = {
          file: selectedFile,
          title: title.trim() || selectedFile.name,
          folderId: selectedFolderId,
          type: 'file',
        };
      }

      await onSave?.(resource);
      
      setResult('success');
      setResultMessage(resourceType === 'url' ? 'Resource added successfully!' : 'File uploaded successfully!');
      
      setTimeout(() => {
        setUrl('');
        setTitle('');
        setSelectedFolderId(null);
        setSelectedFile(null);
        onClose();
        setTimeout(() => {
          setResult(null);
          setResultMessage('');
        }, 300);
      }, 2000);
    } catch (error) {
      setResult('error');
      setResultMessage(error?.message || 'Failed to add resource. Please try again.');
    } finally {
      setIsSaving(false);
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

          {/* Result Message */}
          {result && (
            <View style={[
              styles.resultContainer,
              { 
                backgroundColor: result === 'success' ? '#10B98120' : '#EF444420',
                borderColor: result === 'success' ? '#10B981' : '#EF4444'
              }
            ]}>
              <Icon 
                name={result === 'success' ? 'check-circle' : 'error'} 
                size={24} 
                color={result === 'success' ? '#10B981' : '#EF4444'} 
              />
              <Text style={[
                styles.resultMessage,
                { color: result === 'success' ? '#10B981' : '#EF4444' }
              ]}>
                {resultMessage}
              </Text>
            </View>
          )}

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Add Resource</Text>
          </View>

          {/* Type Toggle */}
          <View style={[styles.typeToggle, { backgroundColor: colors.textDisabled }]}>
            <Pressable 
              style={[
                styles.typeToggleButton, 
                resourceType === 'url' && [styles.typeToggleButtonActive, { backgroundColor: colors.textPrimary }]
              ]}
              onPress={() => setResourceType('url')}
            >
              <Text style={[
                styles.typeToggleButtonText,
                { color: colors.textPrimary },
                resourceType === 'url' && [styles.typeToggleButtonTextActive, { color: colors.background }]
              ]}>URL</Text>
            </Pressable>
            <Pressable 
              style={[
                styles.typeToggleButton,
                resourceType === 'file' && [styles.typeToggleButtonActive, { backgroundColor: colors.textPrimary }]
              ]}
              onPress={() => setResourceType('file')}
            >
              <Text style={[
                styles.typeToggleButtonText,
                { color: colors.textPrimary },
                resourceType === 'file' && [styles.typeToggleButtonTextActive, { color: colors.background }]
              ]}>Document</Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {resourceType === 'url' ? (
              <>
            {/* URL Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>URL *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceHover, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="https://example.com"
                placeholderTextColor={colors.textTertiary}
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Title (Optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Enter a title"
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Folder Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Folder</Text>
              <Pressable 
                style={[styles.folderSelector, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setFolderExpanded(!folderExpanded)}
              >
                <Icon name="folder-open" size={20} color={colors.textSecondary} />
                <Text style={[styles.folderText, { color: colors.textSecondary }]}>
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
                <ScrollView 
                  style={[styles.folderList, { backgroundColor: colors.background, borderColor: colors.border }]}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
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
                </ScrollView>
              )}
            </View>
              </>
            ) : (
              <>
                {/* File Upload Section */}
                <View style={styles.uploadSection}>
                  <Pressable 
                    style={[styles.uploadBox, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={handleFilePicker}
                  >
                    <Icon name="cloud-upload" size={48} color={colors.textTertiary} />
                    <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>Upload Document</Text>
                    <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                      Tap to select files from your device
                    </Text>
                    <Text style={[styles.uploadHint, { color: colors.textTertiary }]}>
                      PDF, Images, Documents supported
                    </Text>
                  </Pressable>
                  
                  {selectedFile && (
                    <View style={[styles.selectedFileContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                      <Icon name="insert-drive-file" size={20} color={colors.primary} />
                      <View style={styles.fileInfo}>
                        <Text style={[styles.fileName, { color: colors.textPrimary }]} numberOfLines={1}>
                          {selectedFile.name}
                        </Text>
                        <Text style={[styles.fileSize, { color: colors.textSecondary }]}>
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </Text>
                      </View>
                      <Pressable onPress={() => setSelectedFile(null)}>
                        <Icon name="close" size={20} color={colors.textSecondary} />
                      </Pressable>
                    </View>
                  )}
                </View>

                {/* Title Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textPrimary }]}>Title (Optional)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                    placeholder="Enter a title"
                    placeholderTextColor={colors.textTertiary}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* Folder Selector */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textPrimary }]}>Folder</Text>
                  <Pressable 
                    style={[styles.folderSelector, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => setFolderExpanded(!folderExpanded)}
                  >
                    <Icon name="folder-open" size={20} color={colors.textSecondary} />
                    <Text style={[styles.folderText, { color: colors.textSecondary }]}>
                      {folders.find(f => (f._id || f.id) === selectedFolderId)?.name || 'Uncategorised'}
                    </Text>
                    <Icon 
                      name={folderExpanded ? "expand-less" : "expand-more"} 
                      size={20} 
                      color={colors.textTertiary} 
                    />
                  </Pressable>
                  
                  {folderExpanded && (
                    <ScrollView 
                      style={[styles.folderList, { backgroundColor: colors.background, borderColor: colors.border }]}
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                    >
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
                    </ScrollView>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: result === 'success' ? '#10B981' : colors.textPrimary },
              (isSaving || (resourceType === 'url' ? !url.trim() : !selectedFile) || result === 'success') && [styles.saveButtonDisabled, { backgroundColor: colors.textTertiary }],
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={isSaving || (resourceType === 'url' ? !url.trim() : !selectedFile) || result === 'success'}
          >
            {isSaving ? (
              <Text style={[styles.saveButtonText, { color: colors.background }]}>Saving...</Text>
            ) : result === 'success' ? (
              <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>✓ Saved</Text>
            ) : (
              <Text style={[styles.saveButtonText, { color: colors.background }]}>Add Resource</Text>
            )}
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
    maxHeight: '90%',
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  resultMessage: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  typeToggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeToggleButtonTextActive: {
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
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
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
  uploadSection: {
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 2,
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
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 12,
    marginTop: 4,
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
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
