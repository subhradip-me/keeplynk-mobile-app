import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export default function LoadingState({ message = 'Loading...', size = 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#37352F" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBFBFA',
    padding: Spacing.xl,
  },
  message: {
    fontSize: FontSizes.md,
    color: '#787774',
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
});
