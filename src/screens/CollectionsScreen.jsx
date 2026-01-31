import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple EmptyState component
const EmptyState = ({ icon, title, message }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
    <Text style={{ fontSize: 48, marginBottom: 16 }}>📁</Text>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{title}</Text>
    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>{message}</Text>
  </View>
);

export default function CollectionsScreen() {
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Collections</Text>
        </View>
        <EmptyState
          icon="folder-open"
          title="No Collections"
          message="Create collections to organize your links into groups"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#FBFBFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#37352F',
    letterSpacing: -0.5,
  },
});
