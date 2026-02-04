import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Switch } from 'react-native';
import AccountSheet from '../modals/AccountSheet';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../features/auth/authHooks';
import { useTheme } from '../features/theme';

export default function ProfileScreen({ navigation }) {
  const { colors, isDark, toggle } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={[styles.profileIcon, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="person" size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => setShowAccountSheet(true)}
          >
            <View style={[styles.avatar, { backgroundColor: colors.backgroundTertiary, borderColor: colors.divider }]}>
              <Text style={[styles.avatarText, { color: colors.textPrimary }]}>
                {avatarInitial}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>
                {displayName}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{displayEmail}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
          <SettingItem
            icon="notifications-none"
            label="Notifications"
            onPress={() => {}}
          />
          <ThemeToggleItem
            icon="palette"
            label="Dark Mode"
            isDark={isDark}
            onToggle={toggle}
          />
          <SettingItem
            icon="language"
            label="Language"
            value="English"
            onPress={() => {}}
          />
        </View>

        {/* App Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
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
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowAccountSheet(true)}
          >
            <Icon name="logout" size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: colors.textTertiary }]}>Version 1.0.0</Text>
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
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.backgroundTertiary }]} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color={colors.textSecondary} />
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: colors.textTertiary }]}>{value}</Text>}
        <Icon name="chevron-right" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

function ThemeToggleItem({ icon, label, isDark, onToggle }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.settingItem, { borderBottomColor: colors.backgroundTertiary }]}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color={colors.textSecondary} />
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <Switch
        value={isDark}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    borderWidth: 2,
  },
  avatarText: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
    letterSpacing: -0.2,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    letterSpacing: -0.1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 6,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 6,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    fontSize: FontSizes.sm,
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
    letterSpacing: -0.1,
  },
  version: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
    fontWeight: FontWeights.medium,
    letterSpacing: 0.5,
  },
});

