import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

interface ImagePickerProps {
  onImageTaken: (uri: string | null) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageTaken }) => {
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const verifyPermissions = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '權限不足',
        '抱歉，我們需要相簿權限才能選擇照片！',
        [{ text: '好的' }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    const image = await ExpoImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5, // 壓縮圖片品質以節省空間
    });

    if (!image.canceled) {
      setPickedImage(image.assets[0].uri);
      onImageTaken(image.assets[0].uri);
    }
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>尚未選擇圖片。</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <Button title="選擇照片" onPress={takeImageHandler} color="#6200ee" />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default ImagePicker;