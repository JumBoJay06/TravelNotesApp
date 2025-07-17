import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ImagePicker from '../components/ImagePicker';
import { useNoteStore } from '../store/noteStore';

type NoteAddEditScreenRouteProp = RouteProp<RootStackParamList, 'NoteAddEditor'>;
type NoteAddEditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteAddEditor'>;

interface Props {
    route: NoteAddEditScreenRouteProp;
    navigation: NoteAddEditScreenNavigationProp;
}

const NoteAddEditScreen = ({ route, navigation }: Props) => {
    const noteId = route.params?.noteId || null;
    const { notes, addNote, updateNote } = useNoteStore();
    const noteToEdit = noteId ? notes.find((n) => n.id == noteId) : null;
    const [title, setTitle] = useState(noteToEdit?.title || '');
    const [content, setContent] = useState(noteToEdit?.content || '');
    const [selectedImages, setSelectedImages] = useState<string[]>(noteToEdit?.imageUris || []);
    const [pickedLocation, setPickedLocation] = useState(
        noteToEdit && noteToEdit.latitude && noteToEdit.longitude
            ? { latitude: noteToEdit.latitude, longitude: noteToEdit.longitude }
            : null
    );

    useEffect(() => {
        if (route.params?.pickedLocation) {
             setPickedLocation(route.params.pickedLocation);
        }
    }, [route.params?.pickedLocation]);

    useLayoutEffect(() => {
        navigation.setOptions({ title: noteId ? '編輯筆記' : '新增筆記' });
    }, [navigation, noteId]);

    const imageTakenHandler = (imageUris: string[]) => {
        setSelectedImages(imageUris);
    };

    const pickLocationHandler = () => {
        navigation.navigate('Map', {
            noteId: noteId,
            initialLocation: pickedLocation,
        });
    };

    const saveNoteHandler = () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('輸入不完整', '請輸入標題和內容。');
            return;
        }

        const noteData = {
            title,
            content,
            imageUris: selectedImages,
            latitude: pickedLocation?.latitude,
            longitude: pickedLocation?.longitude,
        };

        if (noteId && noteToEdit) {
            // 編輯現有筆記
            updateNote({ ...noteData, id: noteId });
        } else {
            // 新增新筆記
            addNote(noteData);
        }

        navigation.goBack(); // 返回上一頁
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90} // 可以微調這個數值
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.textTitleInput}
                        placeholder="標題"
                        onChangeText={setTitle}
                        value={title}
                    />
                    <ImagePicker onImagesTaken={imageTakenHandler} originImages={selectedImages} />
                    
                    <View style={styles.locationContainer}>
                        <Pressable onPress={pickLocationHandler} style={styles.locationButton}>
                            <Text style={styles.locationButtonText}>選擇地點</Text>
                        </Pressable>
                        {pickedLocation && (
                             <Text style={styles.locationText}>
                                 緯度: {pickedLocation.latitude.toFixed(4)}, 經度: {pickedLocation.longitude.toFixed(4)}
                             </Text>
                        )}
                    </View>
                    
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="內容..."
                        onChangeText={setContent}
                        value={content}
                        multiline
                    />
                </View>
            </ScrollView>
             <Pressable style={styles.buttonContainer} onPress={saveNoteHandler}>
                <Text style={styles.buttonText}>儲存筆記</Text>
            </Pressable>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    form: {
        flex: 1,
        margin: 16,
    },
    textTitleInput: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 16,
        padding: 8,
        fontSize: 18,
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        fontSize: 18,
    },
    textArea: {
        flex: 1,
        textAlignVertical: 'top'
    },
    buttonContainer: {
        backgroundColor: '#007cdb',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationContainer: {
        marginBottom: 16,
    },
    locationButton: {
        borderColor: '#007cdb',
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    locationButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationText: {
        marginTop: 8,
        textAlign: 'center',
        color: '#555',
    }
});

export default NoteAddEditScreen;