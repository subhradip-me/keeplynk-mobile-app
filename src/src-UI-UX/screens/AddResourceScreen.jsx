import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AddResourceModal from '../modals/AddResourceModal';

export default function AddResourceScreen({ navigation }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Open modal when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      setVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  const handleClose = () => {
    setVisible(false);
    // Navigate back to previous screen
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  const handleSave = (resource) => {
    console.log('Save resource:', resource);
    handleClose();
  };

  return (
    <View style={styles.container}>
      <AddResourceModal
        visible={visible}
        onClose={handleClose}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add styles if needed
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  }
});