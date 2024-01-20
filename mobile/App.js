// Import necessary dependencies
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Define the main component
const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PULSE</Text>
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.descriptionText}>
          Making short form content from lectures.
        </Text>
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Audio</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>OR</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload PowerPoint</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4d6e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ff4d6e',
    padding: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Pacifico',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 16,
  },
});

export default App;
