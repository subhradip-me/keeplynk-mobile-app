import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const { items: resources = [] } = useSelector((state) => state.resources);
  const { items: folders = [] } = useSelector((state) => state.folders);
  
  // Simple data functions
  const getPopularTags = () => ['React', 'JavaScript', 'Design', 'Tutorial', 'News'];
  const getFrequentFolders = () => folders.slice(0, 5);

  useEffect(() => {
    // Simple search function
    const searchResources = (query) => {
      return resources.filter(r => 
        r.title?.toLowerCase().includes(query.toLowerCase()) ||
        r.url?.toLowerCase().includes(query.toLowerCase())
      );
    };

    if (searchQuery.trim().length > 2) {
      searchResources(searchQuery);
    }
  }, [searchQuery, resources]);

  const popularTags = getPopularTags().slice(0, 4);
  const frequentFolders = getFrequentFolders().slice(0, 3).map(folder => folder.name || folder);

  const filterItems = [
    { icon: 'favorite-border', label: 'Favorites Only', action: () => console.log('Favorites') },
    { icon: 'folder-open', label: 'By Folder', action: () => console.log('By Folder') },
    { icon: 'label-outline', label: 'By Tag', action: () => console.log('By Tag') },
    { icon: 'date-range', label: 'By Date', action: () => console.log('By Date') },
  ];

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#9B9A97" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#808080ff"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Icon name="filter-list" size={20} color="#535353ff" />
        </Pressable>
      </View>

      {/* Suggestions (shown when empty) */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Used Tags</Text>
          <View style={styles.tagContainer}>
            {popularTags.map((tag) => (
              <Pressable key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequent Folders</Text>
          {frequentFolders.map((folder) => (
            <Pressable key={folder} style={styles.folderItem}>
              <Icon name="folder" size={18} color="#787774" />
              <Text style={styles.folderText}>{folder}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeFilterModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeFilterModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {filterItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                    index === filterItems.length - 1 && styles.menuItemLast
                  ]}
                  onPress={() => {
                    item.action();
                    closeFilterModal();
                  }}
                >
                  <Icon name={item.icon} size={20} color="#37352F" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  searchContainer: {
    width: 24,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F6F3',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 28,
  },
  filterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#37352F',
    padding: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#787774',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F7F6F3',
    borderRadius: 3,
  },
  tagText: {
    fontSize: 14,
    color: '#37352F',
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    borderRadius: 3,
    marginBottom: 2,
  },
  folderText: {
    fontSize: 15,
    color: '#37352F',
    letterSpacing: -0.1,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    top: 62   ,
    right: 16,
  },
  modalContent: {
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 180,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemPressed: {
    backgroundColor: '#F7F6F3',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    color: '#37352F',
    fontWeight: '400',
  },
});
