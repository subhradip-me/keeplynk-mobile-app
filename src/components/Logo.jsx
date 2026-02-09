import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../features/theme';

export default function Logo({ size = 60, color }) {
  const { colors, isDark } = useTheme();
  const strokeWidth = size * 0.08;
  const linkColor = color || (isDark ? '#FFFFFF' : colors.primary);
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Left part of chain link */}
      <View
        style={[
          styles.linkPart,
          {
            left: 0,
            width: size * 0.3,
            height: size * 0.5,
            borderLeftWidth: strokeWidth,
            borderTopWidth: strokeWidth,
            borderBottomWidth: strokeWidth,
            borderColor: linkColor,
            borderRadius: size * 0.25,
          },
        ]}
      />
      
      {/* Right part of chain link */}
      <View
        style={[
          styles.linkPart,
          {
            right: 0,
            width: size * 0.3,
            height: size * 0.5,
            borderRightWidth: strokeWidth,
            borderTopWidth: strokeWidth,
            borderBottomWidth: strokeWidth,
            borderColor: linkColor,
            borderRadius: size * 0.25,
          },
        ]}
      />
      
      {/* Center connecting line */}
      <View
        style={[
          styles.centerLine,
          {
            width: size * 0.4,
            height: strokeWidth,
            backgroundColor: linkColor,
            top: (size - strokeWidth) / 2,
          },
        ]}
      />
      
      {/* Decorative dots */}
      <View
        style={[
          styles.dot,
          {
            top: 0,
            width: size * 0.08,
            height: size * 0.08,
            borderRadius: size * 0.04,
            backgroundColor: color || colors.primaryLight,
          },
        ]}
      />
      <View
        style={[
          styles.dot,
          {
            bottom: 0,
            width: size * 0.08,
            height: size * 0.08,
            borderRadius: size * 0.04,
            backgroundColor: color || colors.primaryLight,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkPart: {
    position: 'absolute',
    borderColor: 'transparent',
  },
  centerLine: {
    position: 'absolute',
  },
  dot: {
    position: 'absolute',
    left: '46%',
  },
});
