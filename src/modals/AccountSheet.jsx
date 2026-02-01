import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Simple icon component

export default function AccountSheet({ visible, onClose, onLogout, user, onAccountDetails }) {
  const navigation = useNavigation();
  const slideAnim = React.useRef(new Animated.Value(200)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 95,
        friction: 10,
      }).start();
    } else {
      slideAnim.setValue(200);
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.handle} />
          
          <View style={styles.container}>
            {/* Account Info */}
            <View style={styles.account}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>

              <View>
                <Text style={styles.name}>
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`.toUpperCase() 
                    : 'User'}
                </Text>
                <Text style={styles.email}>{user?.email || 'No email'}</Text>
              </View>
            </View>

            <Divider />

            {/* Actions */}
            <Item icon="person-outline" label="Account details" onPress={() => {
              onClose();
              setTimeout(() => {
                navigation.navigate('Profile');
              }, 300);
            }} />
            <Item icon="add" label="Add another account" onPress={onClose} />

            <Divider />

            <Item
              icon="logout"
              label="Log out"
              danger
              onPress={() => {
                Alert.alert(
                  'Log Out',
                  'Are you sure you want to log out?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Log Out',
                      style: 'destructive',
                      onPress: () => {
                        onClose();
                        // Use setTimeout to ensure modal closes before navigation
                        setTimeout(() => {
                          if (onLogout) {
                            onLogout();
                          }
                        }, 300);
                      },
                    },
                  ],
                );
              }}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

function Item({ icon, label, danger, onPress }) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Icon
        name={icon}
        size={22}
        color={danger ? '#D32F2F' : '#000000ff'}
      />
      <Text style={[styles.label, danger && styles.labelDanger]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#000000ff',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  container: {
    paddingHorizontal: 24,
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#707070ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: -12,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: -0.2,
  },
  labelDanger: {
    color: '#DC3545',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 16,
    marginHorizontal: -8,
  },
});
