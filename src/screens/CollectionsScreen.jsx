import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../features/theme';

// Simple EmptyState component
const EmptyState = ({ icon, title, message, colors }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
    <Text style={{ fontSize: 48, marginBottom: 16 }}>📁</Text>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: colors.textPrimary }}>{title}</Text>
    <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>{message}</Text>
  </View>
);

export default function CollectionsScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Collections</Text>
        </View>
        <EmptyState
          icon="folder-open"
          title="No Collections"
          message="Create collections to organize your links into groups"
          colors={colors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
