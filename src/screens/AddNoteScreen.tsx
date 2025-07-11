import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView, Text, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { addNote } from '../redux/notesSlice';
import ImagePicker from '../components/ImagePicker';
import { RootState } from '../redux/store';

type AddNoteScreenRouteProp = RouteProp<RootStackParamList, 'AddNote'>;
type AddNoteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddNote'>;

interface Props {
    route: AddNoteScreenRouteProp;
    navigation: AddNoteScreenNavigationProp;
}

const AddNoteScreen = ({ route, navigation }: Props) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { noteId } = route.params;

    const dispatch = useDispatch();

    useSelector((state: RootState) => {
        if (noteId) {
            const foundNote = state.notes.notes.find((n) => n.id === noteId);
            setTitle(foundNote?.title || '');
            setContent(foundNote?.content || '');
            setSelectedImage(foundNote?.imageUri || null);
            return foundNote || null;
        }
        return null;
    });

    const imageTakenHandler = (imageUri: string | null) => {
        setSelectedImage(imageUri);
    };

    const saveNoteHandler = () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('輸入不完整', '請輸入標題和內容。');
            return;
        }

        dispatch(addNote({ title, content, imageUri: selectedImage, id: noteId || null  }));
        navigation.goBack(); // 返回上一頁
    };

    return (
        <View style={{ flex: 1 }}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.textTitleInput}
                        placeholder="標題"
                        onChangeText={setTitle}
                        value={title}
                    />
                    <ImagePicker onImageTaken={imageTakenHandler} />
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="內容..."
                        onChangeText={setContent}
                        value={content}
                        multiline
                    />
                </View>
            <Pressable style={styles.buttonContainer} onPress={saveNoteHandler}>
                <Text style={styles.buttonText}>儲存筆記</Text>
            </Pressable>
        </View>

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
    }
});

export default AddNoteScreen;