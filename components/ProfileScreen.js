import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { auth } from '../firebase';

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login'); // Correct navigation
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.info}>Email: {user ? user.email : 'Not signed in'}</Text>
      <CustomButton title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileScreen;