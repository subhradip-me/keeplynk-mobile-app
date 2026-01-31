import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EmptyState from '../components/EmptyState';

export default function CollectionsScreen() {
  return (
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
  );
}

const styles = StyleSheet.create({
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
