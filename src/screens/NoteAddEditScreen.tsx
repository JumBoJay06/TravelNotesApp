import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { addNote, updateNote } from '../redux/notesSlice';
import ImagePicker from '../components/ImagePicker';
import { RootState } from '../redux/store';

type NoteAddEditScreenRouteProp = RouteProp<RootStackParamList, 'NoteAddEditor'>;
type NoteAddEditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteAddEditor'>;

interface Props {
    route: NoteAddEditScreenRouteProp;
    navigation: NoteAddEditScreenNavigationProp;
}

const NoteAddEditScreen = ({ route, navigation }: Props) => {
    const noteId = route.params?.noteId || null;
    const noteToEdit = useSelector((state: RootState) =>
        noteId ? state.notes.notes.find((n) => n.id === noteId) : null
    );
    const [title, setTitle] = useState(noteToEdit?.title || ''); // 這裡的初始值設定是好的
    const [content, setContent] = useState(noteToEdit?.content || '');
    const [selectedImage, setSelectedImage] = useState<string | null>(noteToEdit?.imageUri || null);
    

    const dispatch = useDispatch();

    useEffect(() => {
        // 狀態初始化已經在 useState 中處理，這個 useEffect 可以移除
        // 如果保留，它會在 noteToEdit 變化時重置使用者的輸入
    }, [noteToEdit]); // 建議移除此 useEffect

    useLayoutEffect(() => {
        navigation.setOptions({ title: noteId ? '編輯筆記' : '新增筆記' });
    }, [navigation, noteId]);
    
    const imageTakenHandler = (imageUri: string | null) => {
        setSelectedImage(imageUri);
    };

    const saveNoteHandler = () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('輸入不完整', '請輸入標題和內容。');
            return;
        }

        if (noteId && noteToEdit) {
            // 編輯現有筆記
            dispatch(updateNote({title, content, imageUri: selectedImage, id: noteId}));
        } else {
            // 新增新筆記
             dispatch(addNote({ title, content, imageUri: selectedImage}));
        }
    
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
                <ImagePicker onImageTaken={imageTakenHandler} originImage={selectedImage} />
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

export default NoteAddEditScreen;