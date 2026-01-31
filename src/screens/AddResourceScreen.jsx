import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AddResourceModal from '../modals/AddResourceModal';

export default function AddResourceScreen({ navigation = { addListener: () => () => {}, goBack: () => {} } }) {
  const [visible, setVisible] = useState(true); // Start visible by default

  const handleClose = () => {
    setVisible(false);
    // Navigate back to previous screen  
    console.log('Closing add resource screen');
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