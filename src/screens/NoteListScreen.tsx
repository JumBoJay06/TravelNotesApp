import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import NoteItem from '../components/NoteItem';
import { useNoteStore } from '../store/noteStore';

type NoteListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteList'>;

interface Props {
    navigation: NoteListScreenNavigationProp;
}

const NoteListScreen = ({ navigation }: Props) => {
    const { notes, status, loadNotes, saveNotes } = useNoteStore();

    // 載入筆記資料
    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    // 當 notes 狀態改變時，自動儲存到 AsyncStorage
    useEffect(() => {
        // 只有在非載入狀態時才儲存，避免初始載入時就覆蓋資料
        if (status !== 'loading') {
            saveNotes();
        }
    }, [notes, saveNotes, status]);

    if (status === 'loading') {
        return <View style={styles.emptyListText}><Text>載入中...</Text></View>
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                {
                    notes.length === 0 ?
                        <View style={styles.emptyListText}><Text>還沒有任何筆記，點擊下方按鈕新增吧！</Text></View> :
                        <View style={styles.noteList}>
                            <FlatList
                                data={notes}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <NoteItem
                                        note={item}
                                        onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
                                    />
                                )}
                            />
                        </View>
                }
            </View>
            <Pressable onPress={() => navigation.navigate('NoteAddEditor')} style={styles.addPressable}>
                <Text style={styles.addText}>新增筆記</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    emptyListText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    noteList: {
        flex: 1,
        padding: 16,
    },
    addPressable: {
        backgroundColor: '#007cdb',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    addText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default NoteListScreen;