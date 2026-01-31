import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../features/auth/authHooks';

export default function Header({ onAccountPress, onMorePress }) {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleMorePress = () => {
    setModalVisible(true);
    if (onMorePress) onMorePress();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const menuItems = [
    { icon: 'settings', label: 'Settings', action: () => console.log('Settings') },
    { icon: 'delete-outline', label: 'Trash', action: () => console.log('Trash') },
    { icon: 'help-outline', label: 'Help & Support', action: () => console.log('Help') },
    { icon: 'info-outline', label: 'About', action: () => console.log('About') },
  ];

  return (
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.leftSection}>
        <Pressable 
          onPress={onAccountPress} 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed
          ]}
        >
          <View style={styles.headerProfileButton}>
            <View style={styles.headerProfileIcon}>
              <Text style={styles.headerProfileInitial}>{user?.firstName?.[0] || 'U'}</Text>
            </View>
            <Text style={styles.headerProfileText}>{user?.firstName} {user?.lastName}</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#7f7f7fff" />
          </View>
        </Pressable>
      </View>
      {/* Right side */}
      <View style={styles.rightSection}>
        <Pressable 
          onPress={handleMorePress} 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed
          ]}
        >
          <Icon name="more-horiz" size={20} color="#37352F" />
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
            <View style={styles.modalContent}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                    index === menuItems.length - 1 && styles.menuItemLast
                  ]}
                  onPress={() => {
                    item.action();
                    closeModal();
                  }}
                >
                  <Icon name={item.icon} size={20} color="#37352F" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
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
    backgroundColor: '#ffffffff',
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
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',   
  },
  headerProfileInitial: {
    fontSize: 18,
    color: '#7f7f7fff',
  },

  headerProfileText: {
    fontSize: 15,
    color: '#7f7f7fff',
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
  iconButtonPressed: {
    backgroundColor: '#F7F6F3',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#37352F',
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
    backgroundColor: '#ffffffff',
    borderRadius: 6,
    minWidth: 180,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#EBEBEA',
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
  menuItemPressed: {
    backgroundColor: '#F7F6F3',
  },
  menuItemText: {
    fontSize: 14,
    color: '#37352F',
    letterSpacing: -0.1,
  },
});
