import React, { useEffect, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RootState, AppDispatch } from '../redux/store';
import { loadNotesAsync, saveNotesAsync } from '../redux/notesSlice';
import NoteItem from '../components/NoteItem';

type NoteListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteList'>;

interface Props {
  navigation: NoteListScreenNavigationProp;
}

const NoteListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, status } = useSelector((state: RootState) => state.notes);

  // 載入筆記資料
  useEffect(() => {
    dispatch(loadNotesAsync());
  }, [dispatch]);

  // 【還原】當 notes 狀態改變時，自動儲存到 AsyncStorage
  useEffect(() => {
    // 只有在非載入狀態時才儲存，避免初始載入時就覆蓋資料
    if (status !== 'loading') {
      dispatch(saveNotesAsync(notes));
    }
  }, [notes, dispatch, status]);

  // 設定導覽列右側的按鈕
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('AddNote')} title="新增" color="#6200ee" />
      ),
    });
  }, [navigation]);

  if (status === 'loading') {
      return <View style={styles.centered}><Text>載入中...</Text></View>
  }

  if (notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>還沒有任何筆記，點擊右上角新增吧！</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default NoteListScreen;