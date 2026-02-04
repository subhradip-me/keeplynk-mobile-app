import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../features/theme';

export default function PreviewResourceModal({ visible, onClose, resource, onEdit, onDelete, onToggleFavorite }) {
  const { colors } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const [copied, setCopied] = useState(false);

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

  const getFavicon = (url) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const openUrl = async () => {
    if (resource?.url) {
      try {
        await Linking.openURL(resource.url);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!resource) return null;

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
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: getFavicon(resource.url) }}
                style={styles.favicon}
                onError={() => {}}
              />
              <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
                {resource.title || 'Untitled'}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* URL */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>URL</Text>
              <Pressable onPress={openUrl} style={[styles.urlContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Icon name="link" size={18} color={colors.primary} />
                <Text style={[styles.url, { color: colors.primary }]} numberOfLines={2}>
                  {resource.url}
                </Text>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    Clipboard.setString(resource.url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {copied ? (
                    <Icon name="check" size={16} color={colors.success} />
                  ) : (
                    <Icon name="content-copy" size={16} color={colors.primary} />
                  )}
                </Pressable>
              </Pressable>
            </View>

            {/* Description */}
            {resource.description && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Description</Text>
                <Text style={[styles.description, { backgroundColor: colors.surfaceHover, borderColor: colors.border, color: colors.textPrimary }]}>{resource.description}</Text>
              </View>
            )}

            {/* Folder */}
            {resource.folder && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Folder</Text>
                <View style={[styles.folderBadge, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
                  <Icon 
                    name="folder" 
                    size={18} 
                    color={typeof resource.folder === 'object' ? resource.folder.color : colors.primary} 
                  />
                  <Text style={[styles.folderName, { color: colors.textPrimary }]}>
                    {typeof resource.folder === 'object' ? resource.folder.name : resource.folder}
                  </Text>
                </View>
              </View>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {resource.tags.map((tag, index) => {
                    const tagName = typeof tag === 'object' ? tag.name : tag;
                    const tagColor = typeof tag === 'object' ? tag.color : colors.primary;
                    return (
                      <View
                        key={index}
                        style={[styles.tag, { backgroundColor: `${tagColor}20` }]}
                      >
                        <Text style={[styles.tagText, { color: tagColor }]}>
                          {tagName}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Metadata */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Details</Text>
              <View style={styles.metadataRow}>
                <Icon name="access-time" size={16} color={colors.textTertiary} />
                <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                  Created {formatDate(resource.createdAt)}
                </Text>
              </View>
              {resource.updatedAt && resource.updatedAt !== resource.createdAt && (
                <View style={styles.metadataRow}>
                  <Icon name="update" size={16} color={colors.textTertiary} />
                  <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                    Updated {formatDate(resource.updatedAt)}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.actions, { borderTopColor: colors.divider }]}>
            {/* Visit CTA Button */}
            <Pressable
              style={({ pressed }) => [
                styles.visitButton,
                { backgroundColor: colors.textPrimary },
                pressed && styles.visitButtonPressed,
              ]}
              onPress={openUrl}
            >
              <Icon name="open-in-new" size={20} color={colors.background} />
              <Text style={[styles.visitButtonText, { color: colors.background }]}>Visit Website</Text>
            </Pressable>
          </View>
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
    height: '82%',
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favicon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  title: {
    flex: 1,
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
  url: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  folderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  metadataText: {
    fontSize: 14,
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  visitButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  visitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
