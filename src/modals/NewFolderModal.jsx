import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../features/theme';

// Color options
const COLORS = [
  { name: 'Purple', value: '#9333EA' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Pink', value: '#DB2777' },
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Gray', value: '#6B7280' },
];

// Icon options
const ICONS = [
  'folder',
  'folder-open',
  'work',
  'school',
  'shopping-cart',
  'favorite',
  'star',
  'bookmark',
  'label',
  'code',
  'palette',
  'music-note',
  'photo',
  'videocam',
  'sports-esports',
  'restaurant',
];


export default function NewFolderModal({ visible, onClose, onSave }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 90,
        friction: 9,
      }).start();
    } else {
      slideAnim.setValue(300);
      // Reset form when modal is closed
      setName('');
      setDescription('');
      setSelectedColor(COLORS[0].value);
      setSelectedIcon(ICONS[0]);
      setIsSaving(false);
    }
  }, [visible, slideAnim]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter a folder name');
      return;
    }

    setIsSaving(true);
    
    try {
      const folder = {
        name: name.trim(),
        description: description.trim() || '',
        color: selectedColor,
        icon: selectedIcon,
      };

      await onSave?.(folder);
      // Close modal after successful save
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create folder. Please try again.');
      console.error('Error creating folder:', error);
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

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>New Folder</Text>
          </View>

          {/* Form */}
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Folder Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceHover, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Enter folder name"
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="next"
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceHover, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Add a description"
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="done"
              />
            </View>

            {/* Color Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Choose Color</Text>
              
              {/* Color Preview */}
              <View style={[styles.colorPreview, { backgroundColor: colors.surfaceHover, borderColor: colors.border }]}>
                <View style={[styles.previewCircle, { backgroundColor: selectedColor }]}>
                  <Icon name={selectedIcon} size={32} color="#FFFFFF" />
                </View>
                <Text style={[styles.previewText, { color: colors.textSecondary }]}>Preview</Text>
              </View>

              <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                  <Pressable
                    key={color.value}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.value },
                      selectedColor === color.value && [styles.colorOptionSelected, { borderColor: colors.surface }],
                    ]}
                    onPress={() => setSelectedColor(color.value)}
                  >
                    {selectedColor === color.value && (
                      <View style={styles.checkmarkContainer}>
                        <Icon name="check" size={24} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Icon Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Choose Icon</Text>
              <View style={styles.iconGrid}>
                {ICONS.map((icon) => (
                  <Pressable
                    key={icon}
                    style={[
                      styles.iconOption,
                      { backgroundColor: colors.surfaceHover, borderColor: colors.border },
                      selectedIcon === icon && [styles.iconOptionSelected, { borderColor: colors.textPrimary, backgroundColor: colors.backgroundTertiary }],
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Icon
                      name={icon}
                      size={24}
                      color={selectedIcon === icon ? selectedColor : colors.textSecondary}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.textPrimary },
              (!name.trim() || isSaving) && [styles.saveButtonDisabled, { backgroundColor: colors.textTertiary }],
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={!name.trim() || isSaving}
          >
            <Text style={[styles.saveButtonText, { color: colors.surfaceHover }]}>
              {isSaving ? 'Creating...' : 'Create Folder'}
            </Text>
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
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  colorPreview: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 4,
  },
  previewText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
  },
  colorOption: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderWidth: 4,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  checkmarkContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionSelected: {
    borderWidth: 2,
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