import React, { useState } from 'react';
import { View, Pressable, Image, StyleSheet, Alert, Text, FlatList } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface ImagePickerProps {
    originImages?: string[];
    onImagesTaken: (uris: string[]) => void;
}

const ImagePicker = ({ onImagesTaken, originImages }: ImagePickerProps) => {
    const [pickedImages, setPickedImages] = useState<string[]>(originImages || []);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            setIsLoading(false);
            return;
        }

        const image = await ExpoImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [16, 9],
            quality: 0.5,
            allowsMultipleSelection: true, // 允許多選
        });

        if (!image.canceled) {
            const newImages = image.assets.map(asset => asset.uri);
            const updatedImages = [...pickedImages, ...newImages];
            setPickedImages(updatedImages);
            onImagesTaken(updatedImages);
        }
        setIsLoading(false);
    };
    
    const removeImageHandler = (uriToRemove: string) => {
        const updatedImages = pickedImages.filter(uri => uri !== uriToRemove);
        setPickedImages(updatedImages);
        onImagesTaken(updatedImages);
    };

    if (isLoading) {
        return <View style={styles.imageLoadingContainer}><Text>載入中...</Text></View>;
    }

    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreviewContainer}>
                {pickedImages.length === 0 ? (
                    <View style={styles.imagePreviewEmpty}>
                        <Text>尚未選擇圖片。</Text>
                    </View>
                ) : (
                    <FlatList
                        data={pickedImages}
                        horizontal={true}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View style={styles.imageContainer}>
                                <Image style={styles.image} source={{ uri: item }} />
                                <Pressable style={styles.deleteButton} onPress={() => removeImageHandler(item)}>
                                    <Ionicons name="close" size={24} color="#fff" />
                                </Pressable>
                            </View>
                        )}
                    />
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
    imagePreviewContainer: {
        width: '100%',
        marginBottom: 16,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
    },
    imagePreviewEmpty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
        flex: 1,
    },
    imageLoadingContainer: {
        width: '100%',
        marginBottom: 16,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 100,
        justifyContent: 'center',
    },
    imageContainer: {
        width: 200,
        height: 200,
        margin: 8,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    deleteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#0c0c0c95',
        borderRadius: 12,
    },
    imagePickerButton: {
        borderColor: '#007cdb',
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ImagePicker;