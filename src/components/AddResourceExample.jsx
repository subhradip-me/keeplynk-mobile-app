import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import apiService from '../services/api';

/**
 * Example component showing how to add a new resource (bookmark or note)
 * This can be integrated into your AddResourceModal
 */

export default function AddResourceExample({ onResourceAdded, onCancel }) {
  const [type, setType] = useState('bookmark'); // 'bookmark' or 'note'
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState(''); // For notes
  const [tags, setTags] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await apiService.getFolders();
      if (response.success) {
        setFolders(response.data);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoadingFolders(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (type === 'bookmark' && !url) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    setLoading(true);

    try {
      const resourceData = {
        type,
        title,
        description,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        folderId: selectedFolder,
        isFavorite: false,
      };

      // Add type-specific fields
      if (type === 'bookmark') {
        resourceData.url = url;
        // Optionally extract metadata
        resourceData.metadata = {
          domain: new URL(url).hostname,
        };
      } else if (type === 'note') {
        resourceData.content = content;
      }

      const response = await apiService.createResource(resourceData);

      if (response.success) {
        Alert.alert('Success', 'Resource added successfully');
        
        // Reset form
        setUrl('');
        setTitle('');
        setDescription('');
        setContent('');
        setTags('');
        
        // Notify parent
        if (onResourceAdded) {
          onResourceAdded(response.data);
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Type Selector */}
      <Text style={styles.label}>Type</Text>
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'bookmark' && styles.typeButtonActive,
          ]}
          onPress={() => setType('bookmark')}
        >
          <Text
            style={[
              styles.typeButtonText,
              type === 'bookmark' && styles.typeButtonTextActive,
            ]}
          >
            Bookmark
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === 'note' && styles.typeButtonActive]}
          onPress={() => setType('note')}
        >
          <Text
            style={[
              styles.typeButtonText,
              type === 'note' && styles.typeButtonTextActive,
            ]}
          >
            Note
          </Text>
        </TouchableOpacity>
      </View>

      {/* URL Field - Only for bookmarks */}
      {type === 'bookmark' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>URL *</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
            editable={!loading}
          />
        </View>
      )}

      {/* Title */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          editable={!loading}
        />
      </View>

      {/* Content - Only for notes */}
      {type === 'note' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.input, styles.textArea, { height: 120 }]}
            placeholder="Enter note content"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            editable={!loading}
          />
        </View>
      )}

      {/* Tags */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tags</Text>
        <TextInput
          style={styles.input}
          placeholder="javascript, tutorial, web-dev"
          value={tags}
          onChangeText={setTags}
          editable={!loading}
        />
        <Text style={styles.hint}>Separate tags with commas</Text>
      </View>

      {/* Folder Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Folder</Text>
        {loadingFolders ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <View style={styles.folderList}>
            <TouchableOpacity
              style={[
                styles.folderButton,
                !selectedFolder && styles.folderButtonActive,
              ]}
              onPress={() => setSelectedFolder(null)}
            >
              <Text
                style={[
                  styles.folderButtonText,
                  !selectedFolder && styles.folderButtonTextActive,
                ]}
              >
                Uncategorized
              </Text>
            </TouchableOpacity>

            {folders.map((folder) => (
              <TouchableOpacity
                key={folder._id}
                style={[
                  styles.folderButton,
                  selectedFolder === folder._id && styles.folderButtonActive,
                ]}
                onPress={() => setSelectedFolder(folder._id)}
              >
                <Text
                  style={[
                    styles.folderButtonText,
                    selectedFolder === folder._id && styles.folderButtonTextActive,
                  ]}
                >
                  {folder.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Add Resource</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  hint: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  textArea: {
    height: 80,
    paddingTop: Spacing.sm,
    textAlignVertical: 'top',
  },
  folderList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  folderButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  folderButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  folderButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  folderButtonTextActive: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
