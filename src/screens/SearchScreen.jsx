import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinkItem from '../components/LinkItem';
import { useResources } from '../features/resources/resourceHooks';
import { useFolders } from '../features/folders/folderHooks';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(null); // null, 'folder', 'tag'
  const [activeFilters, setActiveFilters] = useState({
    favoritesOnly: false,
    selectedFolder: null,
    selectedTag: null,
  });
  
  // Call hooks unconditionally
  const resourcesHook = useResources();
  const foldersHook = useFolders();
  
  const resources = useMemo(() => resourcesHook?.resources || [], [resourcesHook?.resources]);
  const folders = useMemo(() => foldersHook?.folders || [], [foldersHook?.folders]);
  const loading = resourcesHook?.loading || false;

  // Fetch data on mount
  useEffect(() => {
    if (resourcesHook?.fetchResources) resourcesHook.fetchResources();
    if (foldersHook?.fetchFolders) foldersHook.fetchFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Trigger backend search when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 2 && resourcesHook?.searchResources) {
      const timer = setTimeout(() => {
        resourcesHook.searchResources(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Get all unique tags from resources
  const allTags = useMemo(() => {
    const tagMap = new Map();
    if (Array.isArray(resources)) {
      resources.forEach(resource => {
        if (resource.tags && Array.isArray(resource.tags)) {
          resource.tags.forEach(tag => {
            const tagName = typeof tag === 'object' ? tag.name : tag;
            const tagObj = typeof tag === 'object' ? tag : { name: tag };
            if (tagName && !tagMap.has(tagName)) {
              tagMap.set(tagName, tagObj);
            }
          });
        }
      });
    }
    return Array.from(tagMap.values());
  }, [resources]);

  // Search and filter results
  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let filtered = Array.isArray(resources) ? resources : [];

    // Apply search query (works for all lengths)
    if (query.length > 0) {
      // Find folders matching the search query
      const matchingFolders = folders.filter(f => 
        f.name?.toLowerCase().includes(query)
      );
      const matchingFolderIds = matchingFolders.map(f => f._id);
      
      // Find tags matching the search query
      const matchingTags = allTags.filter(tag => {
        const tagName = typeof tag === 'object' ? tag.name : tag;
        return tagName && tagName.toLowerCase().includes(query);
      });
      const matchingTagNames = matchingTags.map(tag => typeof tag === 'object' ? tag.name : tag);
      
      filtered = filtered.filter(r => {
        // Show resources that belong to matching folders
        if (matchingFolderIds.length > 0 && matchingFolderIds.includes(r.folderId)) {
          return true;
        }
        
        // Show resources that have matching tags
        if (matchingTagNames.length > 0 && r.tags?.some(tag => {
          const tagName = typeof tag === 'object' ? tag.name : tag;
          return matchingTagNames.includes(tagName);
        })) {
          return true;
        }
        
        // Search in title
        if (r.title?.toLowerCase().includes(query)) return true;
        
        // Search in URL
        if (r.url?.toLowerCase().includes(query)) return true;
        
        // Search in description
        if (r.description?.toLowerCase().includes(query)) return true;
        
        // Search in tags (direct match)
        if (r.tags?.some(tag => {
          const tagName = typeof tag === 'object' ? tag.name : tag;
          return tagName && typeof tagName === 'string' && tagName.toLowerCase().includes(query);
        })) return true;
        
        // Search in folder name
        const folderName = typeof r.folder === 'object' ? r.folder?.name : r.folder;
        if (folderName && typeof folderName === 'string' && folderName.toLowerCase().includes(query)) return true;
        
        // Also check folderName field if it exists
        if (r.folderName && typeof r.folderName === 'string' && r.folderName.toLowerCase().includes(query)) return true;
        
        return false;
      });
    }

    // Apply favorites filter
    if (activeFilters.favoritesOnly) {
      filtered = filtered.filter(r => r.isFavorite);
    }

    // Apply folder filter
    if (activeFilters.selectedFolder) {
      filtered = filtered.filter(r => r.folderId === activeFilters.selectedFolder);
    }

    // Apply tag filter
    if (activeFilters.selectedTag) {
      filtered = filtered.filter(r => 
        r.tags?.some(tag => {
          const tagName = typeof tag === 'object' ? tag.name : tag;
          return tagName === activeFilters.selectedTag;
        })
      );
    }

    return filtered;
  }, [searchQuery, resources, folders, allTags, activeFilters]);

  const showResults = searchQuery.trim().length > 0 || 
                      activeFilters.favoritesOnly || 
                      activeFilters.selectedFolder || 
                      activeFilters.selectedTag;

  const popularTags = useMemo(() => {
    // Get unique tag names from tag objects
    const uniqueTagNames = new Set();
    const tagMap = new Map();
    
    allTags.forEach(tag => {
      const tagName = typeof tag === 'object' ? tag.name : tag;
      if (tagName && typeof tagName === 'string' && tagName.trim().length > 0 && !uniqueTagNames.has(tagName)) {
        uniqueTagNames.add(tagName);
        tagMap.set(tagName, tag);
      }
    });
    
    return Array.from(tagMap.values()).slice(0, 8);
  }, [allTags]);
  
  const frequentFolders = useMemo(() => {
    // Ensure folders are valid objects with _id and name
    return folders
      .filter(folder => folder && folder._id && folder.name)
      .slice(0, 5);
  }, [folders]);

  const handleTagPress = (tag) => {
    if (!tag) return;
    const tagName = typeof tag === 'object' ? tag.name : tag;
    if (!tagName) return;
    setActiveFilters(prev => ({
      ...prev,
      selectedTag: prev.selectedTag === tagName ? null : tagName,
    }));
    setSelectionMode(null);
  };

  const handleFolderPress = (folderId) => {
    setActiveFilters(prev => ({
      ...prev,
      selectedFolder: prev.selectedFolder === folderId ? null : folderId,
    }));
    setSelectionMode(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveFilters({
      favoritesOnly: false,
      selectedFolder: null,
      selectedTag: null,
    });
  };

  const toggleFavorites = () => {
    setActiveFilters(prev => ({
      ...prev,
      favoritesOnly: !prev.favoritesOnly,
    }));
  };

  const filterItems = [
    { 
      icon: activeFilters.favoritesOnly ? 'favorite' : 'favorite-border', 
      label: 'Favorites Only', 
      action: toggleFavorites,
      active: activeFilters.favoritesOnly,
    },
    {
      icon: 'folder',
      label: 'Select Folder',
      action: () => setSelectionMode('folder'),
      active: !!activeFilters.selectedFolder,
    },
    {
      icon: 'label',
      label: 'Select Tag',
      action: () => setSelectionMode('tag'),
      active: !!activeFilters.selectedTag,
    },
    { 
      icon: 'clear', 
      label: 'Clear Filters', 
      action: () => {
        clearSearch();
        setSelectionMode(null);
      },
      active: false,
    },
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
            placeholder="Search resources, tags..."
            placeholderTextColor="#808080ff"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Icon name="close" size={18} color="#9B9A97" />
            </Pressable>
          )}
        </View>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Icon name="filter-list" size={20} color="#535353ff" />
        </Pressable>
      </View>

      {/* Active Filters Display */}
      {(activeFilters.favoritesOnly || activeFilters.selectedFolder || activeFilters.selectedTag) && (
        <View style={styles.activeFilters}>
          {activeFilters.favoritesOnly && (
            <View style={styles.filterChip}>
              <Icon name="favorite" size={14} color="#DC2626" />
              <Text style={styles.filterChipText}>Favorites</Text>
            </View>
          )}
          {activeFilters.selectedFolder && (
            <View style={styles.filterChip}>
              <Icon name="folder" size={14} color="#2563EB" />
              <Text style={styles.filterChipText}>
                {folders.find(f => f._id === activeFilters.selectedFolder)?.name || 'Folder'}
              </Text>
              <Pressable onPress={() => handleFolderPress(null)}>
                <Icon name="close" size={14} color="#666" />
              </Pressable>
            </View>
          )}
          {activeFilters.selectedTag && (
            <View style={styles.filterChip}>
              <Icon name="label" size={14} color="#16A34A" />
              <Text style={styles.filterChipText}>{activeFilters.selectedTag}</Text>
              <Pressable onPress={clearSearch}>
                <Icon name="close" size={14} color="#666" />
              </Pressable>
            </View>
          )}
        </View>
      )}

      <ScrollView style={styles.content}>
        {showResults ? (
          // Search Results
          <View style={styles.resultsSection}>
            <Text style={styles.resultsCount}>
              {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
            </Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((resource, index) => (
                <LinkItem
                  key={resource._id || resource.id || index}
                  title={resource.title}
                  url={resource.url}
                  description={resource.description}
                  tags={resource.tags}
                  folder={resource.folder || resource.folderName}
                  isFavorite={resource.isFavorite}
                  type={resource.type}
                />
              ))
            ) : null}
            {!loading && filteredResults.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="search-off" size={64} color="#C5C4C0" />
                <Text style={styles.emptyStateTitle}>No results found</Text>
                <Text style={styles.emptyStateText}>
                  Try different keywords or filters
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Conditional content based on selection mode
          <>
            {selectionMode === 'folder' ? (
              // Show only folders
              <View style={styles.section}>
                <View style={styles.selectionHeader}>
                  <Pressable onPress={() => setSelectionMode(null)} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#37352F" />
                  </Pressable>
                  <Text style={styles.selectionHeaderTitle}>Select Folder</Text>
                </View>
                {folders.map((folder, index) => (
                  <Pressable 
                    key={folder._id || `folder-${index}`} 
                    style={[
                      styles.selectionItem,
                      activeFilters.selectedFolder === folder._id && styles.selectionItemActive,
                    ]}
                    onPress={() => handleFolderPress(folder._id)}
                  >
                    <Icon 
                      name="folder" 
                      size={20} 
                      color={activeFilters.selectedFolder === folder._id ? '#2563EB' : '#787774'} 
                    />
                    <Text style={[
                      styles.selectionItemText,
                      activeFilters.selectedFolder === folder._id && styles.selectionItemTextActive,
                    ]}>
                      {folder.name}
                    </Text>
                    {activeFilters.selectedFolder === folder._id && (
                      <Icon name="check" size={20} color="#2563EB" style={styles.checkIcon} />
                    )}
                  </Pressable>
                ))}
              </View>
            ) : selectionMode === 'tag' ? (
              // Show only tags
              <View style={styles.section}>
                <View style={styles.selectionHeader}>
                  <Pressable onPress={() => setSelectionMode(null)} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#37352F" />
                  </Pressable>
                  <Text style={styles.selectionHeaderTitle}>Select Tag</Text>
                </View>
                <View style={styles.tagSelectionContainer}>
                  {popularTags.map((tag, index) => {
                    const tagName = typeof tag === 'object' ? tag.name : tag;
                    const tagColor = typeof tag === 'object' ? tag.color : '#2563EB';
                    return (
                      <Pressable
                        key={`tag-select-${tagName}-${index}`}
                        style={[
                          styles.tagSelectionItem,
                          activeFilters.selectedTag === tagName && styles.tagSelectionItemActive,
                        ]}
                        onPress={() => handleTagPress(tag)}
                      >
                        <View style={[styles.tagColorDot, { backgroundColor: tagColor }]} />
                        <Text style={[
                          styles.tagSelectionItemText,
                          activeFilters.selectedTag === tagName && styles.tagSelectionItemTextActive,
                        ]}>
                          {tagName}
                        </Text>
                        {activeFilters.selectedTag === tagName && (
                          <Icon name="check" size={18} color="#2563EB" style={styles.checkIcon} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : (
              // Default view - Recent Resources, Tags, and Folders
              <>
                {/* Recent Resources */}
                {resources.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Resources</Text>
                    {resources.slice(0, 10).map((resource, index) => (
                      <LinkItem
                        key={resource._id || resource.id || index}
                        title={resource.title}
                        url={resource.url}
                        description={resource.description}
                        tags={resource.tags}
                        folder={resource.folder || resource.folderName}
                        isFavorite={resource.isFavorite}
                        type={resource.type}
                      />
                    ))}
                  </View>
                )}

                {popularTags.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tags</Text>
                    <View style={styles.tagContainer}>
                      {popularTags.map((tag, index) => {
                        const tagName = typeof tag === 'object' ? tag.name : tag;
                        return (
                          <Pressable 
                            key={`tag-${tagName}-${index}`} 
                            style={[
                              styles.tag,
                              activeFilters.selectedTag === tagName && styles.tagActive,
                            ]}
                            onPress={() => handleTagPress(tag)}
                          >
                            <Text style={[
                              styles.tagText,
                              activeFilters.selectedTag === tagName && styles.tagTextActive,
                            ]}>
                              {tagName}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {frequentFolders.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Folders</Text>
                    {frequentFolders.map((folder, index) => (
                      <Pressable 
                        key={folder._id || `folder-${index}`} 
                        style={[
                          styles.folderItem,
                          activeFilters.selectedFolder === folder._id && styles.folderItemActive,
                        ]}
                        onPress={() => handleFolderPress(folder._id)}
                      >
                        <Icon 
                          name="folder" 
                          size={18} 
                          color={activeFilters.selectedFolder === folder._id ? '#2563EB' : '#787774'} 
                        />
                        <Text style={[
                          styles.folderText,
                          activeFilters.selectedFolder === folder._id && styles.folderTextActive,
                        ]}>
                          {folder.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
        )}
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
                    item.active && styles.menuItemActive,
                    index === filterItems.length - 1 && styles.menuItemLast
                  ]}
                  onPress={() => {
                    item.action();
                    closeFilterModal();
                  }}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={item.active ? "#2563EB" : "#37352F"} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    item.active && styles.menuItemTextActive,
                  ]}>
                    {item.label}
                  </Text>
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
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterChipText: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  resultsSection: {
    paddingTop: 8,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#787774',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#787774',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37352F',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#787774',
    textAlign: 'center',
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  tagText: {
    fontSize: 14,
    color: '#37352F',
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  tagTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  folderItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  folderText: {
    fontSize: 15,
    color: '#37352F',
    letterSpacing: -0.1,
    fontWeight: '400',
  },
  folderTextActive: {
    color: '#2563EB',
    fontWeight: '600',
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
  menuItemActive: {
    backgroundColor: '#EFF6FF',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    color: '#37352F',
    fontWeight: '400',
  },
  menuItemTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
  },
  selectionHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#37352F',
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  selectionItemActive: {
    backgroundColor: '#EFF6FF',
  },
  selectionItemText: {
    flex: 1,
    fontSize: 15,
    color: '#37352F',
    fontWeight: '400',
  },
  selectionItemTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  tagSelectionContainer: {
    paddingTop: 8,
  },
  tagSelectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  tagSelectionItemActive: {
    backgroundColor: '#EFF6FF',
  },
  tagSelectionItemText: {
    flex: 1,
    fontSize: 15,
    color: '#37352F',
    fontWeight: '400',
  },
  tagSelectionItemTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  tagColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
