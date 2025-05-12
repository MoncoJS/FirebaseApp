import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import CustomButton from './CustomButton';
import { auth, db } from '../firebase'; // ลบ storage ออก
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            // ตรวจสอบทั้ง photoURL (จาก auth) และ imageBase64 (จาก Firestore)
            const userData = userDoc.data();
            if (userData.imageBase64) {
              setImage(`data:image/jpeg;base64,${userData.imageBase64}`);
            } else if (user?.photoURL) {
              setImage(user.photoURL);
            }
          }
        } catch (error) {
          console.log("Error loading profile:", error);
        }
      }
    };

    loadProfile();
  }, [user]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!requestResult.granted) {
        Alert.alert(
          'Permission required',
          'Please enable camera roll permissions in settings to upload photos',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // ลดคุณภาพเพื่อลดขนาดไฟล์
      base64: true // เปิดใช้งาน base64
    });

    console.log('ImagePicker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      if (selectedAsset.base64) {
        uploadImage(selectedAsset.base64);
      }
    }
  };

  const uploadImage = async (base64Data) => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setUploading(true);
      
      // ตรวจสอบขนาดข้อมูล (ประมาณ)
      const sizeInBytes = (base64Data.length * 3) / 4;
      if (sizeInBytes > 900000) { // ใกล้เคียง 1MB
        Alert.alert("Image too large", "Please select a smaller image (max 0.9MB)");
        return;
      }

      // อัพเดท Firestore
      await setDoc(doc(db, 'users', user.uid), { 
        imageBase64: base64Data,
        email: user.email,
        lastUpdated: new Date()
      }, { merge: true });
      
      // อัพเดทสถานะ local
      setImage(`data:image/jpeg;base64,${base64Data}`);
      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload error details:", error);
      Alert.alert("Upload Failed", error.message || "Failed to update profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      {uploading ? (
        <View style={styles.profileImageContainer}>
          <ActivityIndicator size="large" color="#fff" style={styles.uploadOverlay} />
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      
      <Text style={styles.info}>Email: {user ? user.email : 'Not signed in'}</Text>
      <CustomButton 
        title="Sign Out" 
        onPress={handleSignOut} 
        disabled={uploading}
      />
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
  uploadButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: '#666',
  },
  uploadOverlay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;