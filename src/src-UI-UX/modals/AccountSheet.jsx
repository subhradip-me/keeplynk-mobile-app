import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AccountSheet({ visible, onClose, onLogout, user, onAccountDetails }) {
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
                if (onAccountDetails) {
                  onAccountDetails();
                }
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#000000ff',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  container: {
    paddingHorizontal: 20,
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000ff',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000ff',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 15,
    color: '#000000ff',
  },
  labelDanger: {
    color: '#D32F2F',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEA',
    marginVertical: 12,
  },
});
