import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../features/auth/authHooks';
import { useTheme } from '../features/theme';

export default function Header({ onAccountPress, onMorePress, activeTab, onAutoOrganise }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleMorePress = () => {
    setModalVisible(true);
    if (onMorePress) onMorePress();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const menuItems = [
    { icon: 'settings', label: 'Settings', action: () => navigation.navigate('Profile') },
    { icon: 'delete-outline', label: 'Trash', action: () => navigation.navigate('Trash') },
    { icon: 'help-outline', label: 'Help & Support', action: () => console.log('Help') },
    { icon: 'info-outline', label: 'About', action: () => console.log('About') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Left side */}
      <View style={styles.leftSection}>
        <Pressable 
          onPress={onAccountPress} 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { backgroundColor: colors.hover }
          ]}
        >
          <View style={styles.headerProfileButton}>
            <View style={[styles.headerProfileIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.headerProfileInitial, { color: colors.textSecondary }]}>{user?.firstName?.[0] || 'U'}</Text>
            </View>
            <Text style={[styles.headerProfileText, { color: colors.textSecondary }]}>{user?.firstName}'s space</Text>
            <Icon name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
          </View>
        </Pressable>
      </View>
      {/* Right side */}
      <View style={styles.rightSection}>
        {activeTab === 'Uncategorised' && (
          <Pressable 
            onPress={() => onAutoOrganise?.()} 
            style={({ pressed }) => [
              styles.iconButton,
              pressed && { backgroundColor: colors.hover }
            ]}
          >
            <Icon name="smart-toy" size={20} color={colors.textSecondary} />
          </Pressable>
        )}
        <Pressable 
          onPress={handleMorePress} 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { backgroundColor: colors.hover }
          ]}
        >
          <Icon name="more-horiz" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: colors.backgroundSecondary },
                    index === menuItems.length - 1 && styles.menuItemLast
                  ]}
                  onPress={() => {
                    item.action();
                    closeModal();
                  }}
                >
                  <Icon name={item.icon} size={20} color={colors.textSecondary} />
                  <Text style={[styles.menuItemText, { color: colors.textSecondary }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    borderRadius: 28,
  },
  headerProfileIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',   
  },
  headerProfileInitial: {
    fontSize: 18,
  },

  headerProfileText: {
    fontSize: 15,
    fontWeight: '700',
  },
  headerProfileButton: {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 28,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 6,
    borderRadius: 28,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
  modalContent: {
    borderRadius: 6,
    minWidth: 180,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
   // borderBottomWidth: 1,
    //borderBottomColor: '#EBEBEA',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    letterSpacing: -0.1,
  },
});
