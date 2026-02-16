import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../features/theme';

export default function AutoOrganiseSheet({ 
  visible, 
  onClose, 
  onOrganise,
  selectedCount = 0,
  totalUncategorised = 0,
  folderId = null,
  tags = []
}) {
  const { colors } = useTheme();
  const [isOrganising, setIsOrganising] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'error' | null
  const [resultMessage, setResultMessage] = useState('');
  const slideAnim = React.useRef(new Animated.Value(400)).current;

  // Calculate if there are items to organize
  const itemsToOrganize = selectedCount > 0 ? selectedCount : totalUncategorised;
  const hasItemsToOrganize = itemsToOrganize > 0;
  const isUncategorisedFolder = folderId && !selectedCount && !totalUncategorised;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 95,
        friction: 10,
      }).start();
      // Reset states when modal opens
      setResult(null);
      setResultMessage('');
    } else {
      slideAnim.setValue(400);
    }
  }, [visible, slideAnim]);

  const handleOrganise = async () => {
    // Validate that there are items to organize
    if (!hasItemsToOrganize && !isUncategorisedFolder) {
      setResult('error');
      setResultMessage('No items available to organize. Please add some uncategorised links first.');
      return;
    }

    setIsOrganising(true);
    setResult(null);
    setResultMessage('');
    
    try {
      await onOrganise?.();
      setResult('success');
      setResultMessage('Auto organize started successfully! Your resources are being organized.');
      
      // Auto close after 3 seconds on success
      setTimeout(() => {
        onClose();
        // Reset states after closing
        setTimeout(() => {
          setResult(null);
          setResultMessage('');
        }, 300);
      }, 3000);
    } catch (error) {
      setResult('error');
      setResultMessage(error?.message || 'Failed to start auto organize. Please try again.');
    } finally {
      setIsOrganising(false);
    }
  };

  const handleClose = () => {
    if (!isOrganising) {
      onClose();
      // Reset states after closing
      setTimeout(() => {
        setResult(null);
        setResultMessage('');
      }, 300);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.backgroundTertiary, transform: [{ translateY: slideAnim }] }
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.textPrimary }]} />

          {/* Result Message */}
          {result && (
            <View style={[
              styles.resultContainer,
              { 
                backgroundColor: result === 'success' ? '#10B98120' : '#EF444420',
                borderColor: result === 'success' ? '#10B981' : '#EF4444'
              }
            ]}>
              <Icon 
                name={result === 'success' ? 'check-circle' : 'error'} 
                size={24} 
                color={result === 'success' ? '#10B981' : '#EF4444'} 
              />
              <Text style={[
                styles.resultMessage,
                { color: result === 'success' ? '#10B981' : '#EF4444' }
              ]}>
                {resultMessage}
              </Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FFD700', '#FDB931']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientIcon}
              >
                <Text style={styles.sparkleIcon}>✨</Text>
              </LinearGradient>
            </View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Auto Organise
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Let AI organize your links automatically
            </Text>
          </View>

          {/* Info Section */}
          <View style={[styles.infoSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Icon name="link" size={20} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                {!hasItemsToOrganize && !isUncategorisedFolder
                  ? 'No items available to organize'
                  : tags && tags.length === 0
                    ? 'Items with no tags available to organize'
                    : selectedCount > 0 
                      ? `${selectedCount} ${selectedCount === 1 ? 'link' : 'links'} selected`
                      : isUncategorisedFolder
                        ? 'Items in this uncategorised folder'
                        : `${totalUncategorised} uncategorised ${totalUncategorised === 1 ? 'link' : 'links'}`
                }
              </Text>
            </View>
            {(hasItemsToOrganize || isUncategorisedFolder) && (
              <View style={styles.infoRow}>
                <Icon name="auto-awesome" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                  AI will suggest folders and tags
                </Text>
              </View>
            )}
            {!hasItemsToOrganize && !isUncategorisedFolder && (
              <View style={styles.infoRow}>
                <Icon name="info" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Add some uncategorised links to get started
                </Text>
              </View>
            )}
          </View>

          {/* Features */}
          <View style={styles.features}>
            <FeatureItem 
              icon="folder"
              text="Create or assign to existing folders"
              colors={colors}
            />
            <FeatureItem 
              icon="local-offer"
              text="Generate relevant tags"
              colors={colors}
            />
            <FeatureItem 
              icon="smart-toy"
              text="Smart categorization based on content"
              colors={colors}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={handleOrganise}
              disabled={isOrganising || result === 'success' || (!hasItemsToOrganize && !isUncategorisedFolder)}
              style={({ pressed }) => [
                pressed && { opacity: 0.8 }
              ]}
            >
              <LinearGradient
                colors={
                  result === 'success' 
                    ? ['#10B981', '#059669'] 
                    : (!hasItemsToOrganize && !isUncategorisedFolder)
                      ? ['#9CA3AF', '#6B7280']
                      : ['#FFD700', '#FDB931', '#E5E4E2']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.organiseButton,
                  (isOrganising || result || (!hasItemsToOrganize && !isUncategorisedFolder)) && styles.organiseButtonDisabled
                ]}
              >
                {isOrganising ? (
                  <>
                    <ActivityIndicator color="#37352F" />
                    <Text style={styles.organiseButtonText}>Organizing...</Text>
                  </>
                ) : result === 'success' ? (
                  <>
                    <Icon name="check-circle" size={20} color="#FFFFFF" />
                    <Text style={[styles.organiseButtonText, { color: '#FFFFFF' }]}>Success!</Text>
                  </>
                ) : (!hasItemsToOrganize && !isUncategorisedFolder) ? (
                  <>
                    <Icon name="info" size={20} color="#FFFFFF" />
                    <Text style={[styles.organiseButtonText, { color: '#FFFFFF' }]}>No Items Available</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.sparkle}>✨</Text>
                    <Text style={styles.organiseButtonText}>Start Organising</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleClose}
              disabled={isOrganising}
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: colors.surface },
                pressed && { opacity: 0.7 },
                isOrganising && styles.cancelButtonDisabled
              ]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>
                {result ? 'Close' : 'Cancel'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

function FeatureItem({ icon, text, colors }) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Icon name={icon} size={18} color={colors.textSecondary} />
      </View>
      <Text style={[styles.featureText, { color: colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
    opacity: 0.3,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  resultMessage: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  gradientIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sparkleIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  infoSection: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  features: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    letterSpacing: -0.1,
  },
  actions: {
    paddingHorizontal: 24,
    gap: 12,
  },
  organiseButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  organiseButtonDisabled: {
    opacity: 0.7,
  },
  sparkle: {
    fontSize: 18,
  },
  organiseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37352F',
    letterSpacing: 0.2,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
