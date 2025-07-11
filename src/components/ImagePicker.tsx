import React, { useState } from 'react';
import { View, Pressable, Image, StyleSheet, Alert, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

interface ImagePickerProps {
    originImage?: string;
    onImageTaken: (uri: string | null) => void;
}

const ImagePicker = ({ onImageTaken, originImage }: ImagePickerProps) => {
    const [pickedImage, setPickedImage] = useState<string | null>(originImage || null);

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
            <Pressable onPress={takeImageHandler} style={styles.imagePickerButton}>
                <Text style={styles.buttonText}>選擇照片</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 16,
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
    imagePickerButton: {
        backgroundColor: '#007cdb',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ImagePicker;