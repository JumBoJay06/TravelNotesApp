import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert } from 'react-native';
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

const NoteDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { noteId } = route.params;
  const dispatch = useDispatch();

  const note = useSelector((state: RootState) =>
    state.notes.notes.find((n) => n.id === noteId)
  );

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

  if (!note) {
    return (
      <View style={styles.centered}>
        <Text>找不到這篇筆記！</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {note.imageUri && (
        <Image source={{ uri: note.imageUri }} style={styles.image} />
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>
          {new Date(note.date).toLocaleString()}
        </Text>
        <Text style={styles.content}>{note.content}</Text>
        <View style={styles.buttonContainer}>
            <Button title="刪除筆記" color="red" onPress={deleteHandler} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    lineHeight: 26,
    color: '#555',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
      marginTop: 30,
  }
});

export default NoteDetailScreen;