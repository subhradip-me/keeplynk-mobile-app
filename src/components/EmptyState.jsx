import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../features/theme';
// Simple icon component to replace vector icons
const Icon = ({ name, size = 24, color = '#000' }) => {
  const iconMap = {
    'folder-open': '📂',
    'bookmark-border': '🔖',
    'favorite-border': '🤍',
    'collections-bookmark': '📚',
  };
  return (
    <Text style={{ fontSize: size, color: color }}>
      {iconMap[name] || '📂'}
    </Text>
  );
};
import { Colors, Spacing, FontSizes, FontWeights } from '../constants/theme';

export default function EmptyState({ 
  icon = 'inbox', 
  title, 
  message, 
  actionText, 
  onAction 
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.hover }]}>
        <Icon name={icon} size={48} color={colors.textSecondary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {actionText && onAction && (
        <Pressable 
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.text },
            pressed && styles.actionButtonPressed
          ]}
          onPress={onAction}
        >
          <Text style={[styles.actionText, { color: colors.surface }]}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: 4,
    marginTop: Spacing.lg,
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.surface,
    letterSpacing: -0.1,
  },
});
