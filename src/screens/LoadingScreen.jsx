import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useTheme } from '../features/theme';

export default function LoadingScreen() {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  return (
    <View style={[styles.container]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Image
          source={require('../assets/logo_.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* App Name */}
        <Text style={[styles.appName, { color: colors.textPrimary }]}>
          KeepLynk
        </Text>
        
        {/* Tagline */}
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          AI-Powered Organization
        </Text>
        
        {/* Progress Bar Container */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { backgroundColor: colors.progress, width: progressWidth }
              ]}
            />
          </View>
        </View>
        
        {/* Loading Text */}
        <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
          Preparing your experience...
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 80,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
  },
});
