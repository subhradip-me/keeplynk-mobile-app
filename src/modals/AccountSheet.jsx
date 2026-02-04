import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../features/theme';

// Simple icon component

export default function AccountSheet({ visible, onClose, onLogout, user, onAccountDetails }) {
  const { colors } = useTheme();
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
            { backgroundColor: colors.background, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />
          
          <View style={styles.container}>
            {/* Account Info */}
            <View style={[styles.account, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: colors.textSecondary }]}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>

              <View>
                <Text style={[styles.name, { color: colors.textPrimary }]}>
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`.toUpperCase() 
                    : 'User'}
                </Text>
                <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'No email'}</Text>
              </View>
            </View>

            <Divider colors={colors} />

            {/* Actions */}
            <Item colors={colors} icon="person-outline" label="Account details" onPress={() => {
              onClose();
              setTimeout(() => {
                navigation.navigate('Profile');
              }, 300);
            }} />
            <Item colors={colors} icon="add" label="Add another account" onPress={onClose} />

            <Divider colors={colors} />

            <Item
              colors={colors}
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

function Item({ icon, label, danger, onPress, colors }) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Icon
        name={icon}
        size={22}
        color={danger ? colors.error : colors.textPrimary}
      />
      <Text style={[styles.label, { color: danger ? colors.error : colors.textPrimary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Divider({ colors }) {
  return <View style={[styles.divider, { backgroundColor: colors.divider }]} />;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 5,
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
    borderRadius: 16,
    borderWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
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
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
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
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    marginHorizontal: -8,
  },
});
