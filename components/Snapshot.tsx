import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Snapshot() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // ฟังก์ชันเปิด camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ฟังก์ชันเลือกภาพจาก gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Gallery permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ฟังก์ชันอัปโหลด snapshot
  const uploadSnapshot = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select or take a snapshot first.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('snapshot', {
        uri: imageUri,
        name: 'snapshot.jpg',
        type: 'image/jpeg',
      } as any);

      // เปลี่ยน URL เป็น endpoint ของคุณ
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Snapshot uploaded successfully!');
      } else {
        Alert.alert('Upload Failed', 'Server returned an error.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload snapshot.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SNAPSHOT</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: '#888' }}>No snapshot yet</Text>
        </View>
      )}

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, { marginTop: 12, width: 150, backgroundColor: 'white' }]}
        onPress={uploadSnapshot}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#232433',
    borderRadius: 12,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    opacity: 0.7,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#ffb300',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    
    color: '#000',
    backgroundColor: 'transparent',
  },
});
