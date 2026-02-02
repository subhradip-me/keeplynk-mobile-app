import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import AccountSheet from '../modals/AccountSheet';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../features/auth/authHooks';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAccountSheet, setShowAccountSheet] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to Auth screen after logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Ensure user data is available
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'User';
  
  const displayEmail = user?.email || 'No email';
  const avatarInitial = user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#37352F" />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.profileIcon}>
            <Icon name="person" size={24} color="#2563EB" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Profile</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => setShowAccountSheet(true)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {avatarInitial}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {displayName}
              </Text>
              <Text style={styles.userEmail}>{displayEmail}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="notifications-none"
            label="Notifications"
            onPress={() => {}}
          />
          <SettingItem
            icon="palette"
            label="Appearance"
            onPress={() => {}}
          />
          <SettingItem
            icon="language"
            label="Language"
            value="English"
            onPress={() => {}}
          />
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="info-outline"
            label="About KeepLynk"
            onPress={() => {}}
          />
          <SettingItem
            icon="description"
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingItem
            icon="privacy-tip"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <SettingItem
            icon="star-border"
            label="Rate App"
            onPress={() => {}}
          />
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowAccountSheet(true)}
          >
            <Icon name="logout" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      <AccountSheet
        visible={showAccountSheet}
        onClose={() => setShowAccountSheet(false)}
        onLogout={handleLogout}
        user={user}
        onAccountDetails={() => setShowAccountSheet(false)}
      />
    </SafeAreaView>
  );
}

function SettingItem({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color={Colors.textSecondary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37352F',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.divider,
  },
  avatarText: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.2,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    letterSpacing: -0.1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundTertiary,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 6,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeights.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 6,
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.error,
    letterSpacing: -0.1,
  },
  version: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
    fontWeight: FontWeights.medium,
    letterSpacing: 0.5,
  },
});

