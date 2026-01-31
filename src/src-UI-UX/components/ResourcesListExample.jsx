import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apiService from '../services/api';
import { Colors, Spacing } from '../constants/theme';

/**
 * Example component showing how to fetch and display resources from the API
 * This can be integrated into your HomeScreen or other screens
 */

export default function ResourcesListExample() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiService.getResources({
        page: pageNum,
        limit: 20,
      });

      if (response.success) {
        if (refresh || pageNum === 1) {
          setResources(response.data);
        } else {
          setResources([...resources, ...response.data]);
        }

        // Check if there are more pages
        if (response.pagination) {
          setHasMore(pageNum < response.pagination.pages);
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load resources');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    loadResources(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadResources(nextPage);
    }
  };

  const handleToggleFavorite = async (resource) => {
    try {
      const response = await apiService.updateResource(resource._id, {
        isFavorite: !resource.isFavorite,
      });

      if (response.success) {
        // Update local state
        setResources(
          resources.map((item) =>
            item._id === resource._id
              ? { ...item, isFavorite: !item.isFavorite }
              : item
          )
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    Alert.alert(
      'Delete Resource',
      'Are you sure you want to delete this resource?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteResource(resourceId);
              setResources(resources.filter((item) => item._id !== resourceId));
              Alert.alert('Success', 'Resource deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete resource');
            }
          },
        },
      ]
    );
  };

  const renderResource = ({ item }) => (
    <View style={styles.resourceCard}>
      {/* Type Badge */}
      <View style={[styles.typeBadge, styles[`${item.type}Badge`]]}>
        <Text style={styles.typeBadgeText}>{item.type}</Text>
      </View>

      {/* Title */}
      <Text style={styles.resourceTitle} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Description */}
      {item.description && (
        <Text style={styles.resourceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {/* URL for bookmarks */}
      {item.url && (
        <Text style={styles.resourceUrl} numberOfLines={1}>
          {item.url}
        </Text>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleFavorite(item)}
        >
          <Icon
            name={item.isFavorite ? 'favorite' : 'favorite-border'}
            size={20}
            color={item.isFavorite ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteResource(item._id)}
        >
          <Icon name="delete-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Icon name="bookmark-border" size={64} color={Colors.textTertiary} />
        <Text style={styles.emptyText}>No resources yet</Text>
        <Text style={styles.emptySubtext}>
          Start adding bookmarks and notes to see them here
        </Text>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={resources}
      renderItem={renderResource}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[Colors.primary]}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  bookmarkBadge: {
    backgroundColor: Colors.primary + '20',
  },
  noteBadge: {
    backgroundColor: Colors.accent + '20',
  },
  documentBadge: {
    backgroundColor: Colors.success + '20',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  resourceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  resourceUrl: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreTagsText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: Spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  footerLoader: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
