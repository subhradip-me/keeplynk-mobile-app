import React, { useState, useRef, memo } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LinkItem = ({ title, url, description, tags = [], folder, isFavorite, type = 'bookmark', onPress, onEdit, onDelete, onToggleFavorite }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 100, right: 16 });
  const moreButtonRef = useRef(null);
  const windowHeight = Dimensions.get('window').height;

  const getFavicon = (linkUrl) => {
    if (!linkUrl) return null;
    try {
      const domain = new URL(linkUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const handleMenuAction = (action) => {
    setMenuVisible(false);
    setTimeout(() => action(), 100);
  };

  const menuItems = [
    { label: 'Edit', icon: 'edit', action: () => onEdit?.() },
    { label: 'Move to Folder', icon: 'folder', action: () => console.log('Move to folder') },
    { label: isFavorite ? 'Remove Favorite' : 'Add to Favorites', icon: isFavorite ? 'favorite' : 'favorite-border', action: () => onToggleFavorite?.() },
    { label: 'Delete', icon: 'delete', action: () => onDelete?.(), danger: true },
  ];

  return (
    <>
      <Pressable 
        onPress={onPress} 
        style={({ pressed }) => [
          styles.container,
          pressed && styles.containerPressed
        ]}
        android_ripple={{ color: '#f1f5f9' }}
      >
        {/* Icon/Favicon */}
        <View style={styles.iconContainer}>
          {type === 'bookmark' && url ? (
            <Image
              source={{ uri: getFavicon(url) }}
              style={styles.favicon}
              onError={() => {}}
            />
          ) : (
            <Icon name="insert-drive-file" size={18} color="#787774" />
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title || 'Untitled'}
          </Text>
          
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}

          {/* Tags and Metadata */}
          <View style={styles.metaContainer}>
            {tags && tags.slice(0, 3).map((tag, index) => {
              const tagName = typeof tag === 'object' ? tag.name : tag;
              const tagColor = typeof tag === 'object' ? tag.color : '#2563EB';
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.tag,
                    { backgroundColor: `${tagColor}20` }
                  ]}
                >
                  <Text style={[styles.tagText, { color: tagColor }]}>
                    {tagName}
                  </Text>
                </View>
              );
            })}
            
            {folder && (
              <View style={styles.folderBadge}>
                <Icon name="folder" size={10} color="#9333EA" />
                <Text style={styles.folderBadgeText}>{folder}</Text>
              </View>
            )}
            
            {isFavorite && (
              <View style={styles.favoriteBadge}>
                <Text style={styles.favoriteBadgeText}>⭐</Text>
              </View>
            )}
          </View>
        </View>

        {/* More button */}
        <Pressable
          ref={moreButtonRef}
          onPress={(e) => {
            e?.stopPropagation?.();
            moreButtonRef.current?.measureInWindow((x, y, width, height) => {
              const menuHeight = 180; // Approximate menu height
              const buttonPosition = y + height;
              const screenPosition = buttonPosition / windowHeight;
              
              // If button is in lower 75% of screen, position menu above
              if (screenPosition > 0.75) {
                // Position above the button
                setMenuPosition({ 
                  top: y - menuHeight - 8,
                  right: 16 
                });
              } else {
                // Position below the button
                setMenuPosition({ 
                  top: y + height + 8,
                  right: 16 
                });
              }
              setMenuVisible(true);
            });
          }}
          style={styles.moreButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="more-vert" size={18} color="#9B9A97" />
        </Pressable>
      </Pressable>

      {/* Action Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuContainer, { top: menuPosition.top, right: menuPosition.right }]}>
            <View style={styles.menuContent}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                    index === menuItems.length - 1 && styles.menuItemLast,
                    index === 0 && styles.menuItemFirst,
                  ]}
                  onPress={() => handleMenuAction(item.action)}
                >
                  <Icon 
                    name={item.icon} 
                    size={18} 
                    color={item.danger ? '#EF4444' : '#37352F'} 
                  />
                  <Text 
                    style={[
                      styles.menuItemText,
                      item.danger && styles.menuItemTextDanger
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  containerPressed: {
    backgroundColor: '#FAFAFA',
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  favicon: {
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181B',
    letterSpacing: -0.1,
  },
  description: {
    fontSize: 12,
    color: '#71717A',
    lineHeight: 16,
    marginTop: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  folderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#FAF5FF',
    borderRadius: 6,
  },
  folderBadgeText: {
    fontSize: 10,
    color: '#9333EA',
    fontWeight: '500',
  },
  favoriteBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#FFFBEB',
    borderRadius: 6,
  },
  favoriteBadgeText: {
    fontSize: 10,
  },
  moreButton: {
    padding: 4,
    marginTop: -4,
    marginRight: -4,
  },
  modalOverlay: {
    flex: 1,
   // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
  },
  menuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 192,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
   // borderBottomWidth: 1,
   // borderBottomColor: '#F4F4F5',
  },
  menuItemFirst: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: '#FAFAFA',
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  menuItemText: {
    fontSize: 14,
    color: '#18181B',
    fontWeight: '400',
  },
  menuItemTextDanger: {
    color: '#EF4444',
  },
});

export default memo(LinkItem);
