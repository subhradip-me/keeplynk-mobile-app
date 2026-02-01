import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const FolderCard = ({ name, itemCount, onPress }) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed
      ]}
      android_ripple={{ color: '#f1f5f9' }}
    >
      <View style={styles.iconContainer}>
        <Icon name="folder" size={28} color="#787774" />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.count}>
        {itemCount || 0} items
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#EBEBEA',
  },
  containerPressed: {
    backgroundColor: '#F7F6F3',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F7F6F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#37352F',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  count: {
    fontSize: 13,
    color: '#787774',
  },
});

export default memo(FolderCard);
