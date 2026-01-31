import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const TABS = ['All', 'Recent', 'Uncategorised', 'Favourite'];

export default function HomeTabs({ activeTab, onTabChange }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.tabPressed,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEA',
  },
  container: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 0,
  },
  tab: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
    marginRight: 8,
    position: 'relative',
  },
  tabPressed: {
    opacity: 0.6,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9B9A97',
    letterSpacing: -0.2,
  },
  tabTextActive: {
    color: '#37352F',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#37352F',
    borderRadius: 2,
  },
});
