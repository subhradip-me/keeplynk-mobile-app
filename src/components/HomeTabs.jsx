import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../features/theme';

const TABS = ['All', 'Recent', 'Uncategorised', 'Favourite'];

export default function HomeTabs({ activeTab, onTabChange }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
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
                { color: activeTab === tab ? colors.textDisabled : colors.textSecondary },
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: colors.text }]} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
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
    letterSpacing: -0.2,
  },
  tabTextActive: {
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 2,
  },
});
