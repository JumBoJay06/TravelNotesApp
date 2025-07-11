import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RootState } from '../redux/store';
import { deleteNote } from '../redux/notesSlice';

type NoteDetailScreenRouteProp = RouteProp<RootStackParamList, 'NoteDetail'>;
type NoteDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteDetail'>;

interface Props {
    route: NoteDetailScreenRouteProp;
    navigation: NoteDetailScreenNavigationProp;
}

const NoteDetailScreen = ({ route, navigation }: Props) => {
    const { noteId } = route.params;
    const dispatch = useDispatch();

    const note = useSelector((state: RootState) =>
        state.notes.notes.find((n) => n.id === noteId)
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={deleteHandler}>
                    <Text style={styles.deleteNoteText}>刪除</Text>
                </Pressable>
            ),
        });
    }, [navigation]);

    const deleteHandler = () => {
        Alert.alert(
            '確認刪除',
            '您確定要刪除這篇筆記嗎？',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '刪除',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(deleteNote(noteId));
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleEditPress = () => {
        navigation.navigate('NoteAddEditor', { noteId });
    };

    if (!note) {
        return (
            <View style={styles.centered}>
                <Text>找不到這篇筆記！</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                {note.imageUri && (
                    <Image source={{ uri: note.imageUri }} style={styles.image} />
                )}
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{note.title}</Text>
                    <Text style={styles.date}>
                        {new Date(note.date).toLocaleString()}
                    </Text>
                    <Text style={styles.content}>{note.content}</Text>

                </View>
            </ScrollView>
            <Pressable style={styles.editButton} onPress={handleEditPress}>
                <Text style={styles.editButtonText}>編輯筆記</Text>
            </Pressable>
        </View>

    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 250,
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 24,
    },
    content: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 18,
        lineHeight: 26,
        padding: 8,
        color: '#555',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteNoteText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingRight: 16,
    },
    editButton: {
        backgroundColor: '#007cdb',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NoteDetailScreen;