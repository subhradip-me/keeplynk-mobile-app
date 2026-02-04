import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../features/theme';

export default function TagChip({ label, color, onPress, style }) {
  const { colors } = useTheme();

  const chipBackgroundColor = color ? `${color}20` : colors.inputBackground;
  const chipTextColor = color || colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: chipBackgroundColor },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <Text style={[styles.text, { color: chipTextColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
