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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
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
    }
  }, [visible, slideAnim]);

  const handleSave = () => {
    if (!name.trim()) {
      console.log('Folder name is required');
      return;
    }

    const folder = {
      name: name.trim(),
      description: description.trim() || '',
      color: selectedColor,
      icon: selectedIcon,
    };

    onSave?.(folder);
    
    // Clear form
    setName('');
    setDescription('');
    setSelectedColor(COLORS[0].value);
    setSelectedIcon(ICONS[0]);
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
            <Text style={styles.title}>New Folder</Text>
          </View>

          {/* Form */}
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Folder Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter folder name"
                placeholderTextColor="#9B9A97"
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="next"
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a description"
                placeholderTextColor="#9B9A97"
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
              <Text style={styles.label}>Choose Color</Text>
              
              {/* Color Preview */}
              <View style={styles.colorPreview}>
                <View style={[styles.previewCircle, { backgroundColor: selectedColor }]}>
                  <Icon name={selectedIcon} size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.previewText}>Preview</Text>
              </View>

              <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                  <Pressable
                    key={color.value}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.value },
                      selectedColor === color.value && styles.colorOptionSelected,
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
              <Text style={styles.label}>Choose Icon</Text>
              <View style={styles.iconGrid}>
                {ICONS.map((icon) => (
                  <Pressable
                    key={icon}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.iconOptionSelected,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Icon
                      name={icon}
                      size={24}
                      color={selectedIcon === icon ? selectedColor : '#666'}
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
              !name.trim() && styles.saveButtonDisabled,
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text style={styles.saveButtonText}>Create Folder</Text>
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
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  colorPreview: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  previewCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  previewText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionSelected: {
    borderWidth: 2,
    borderColor: '#000000ff',
    backgroundColor: '#F7F6F3',
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