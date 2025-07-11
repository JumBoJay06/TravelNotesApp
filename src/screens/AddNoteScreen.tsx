import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { addNote } from '../redux/notesSlice';
import ImagePicker from '../components/ImagePicker';

type AddNoteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddNote'>;

interface Props {
  navigation: AddNoteScreenNavigationProp;
}

const AddNoteScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const dispatch = useDispatch();

  const imageTakenHandler = (imageUri: string | null) => {
    setSelectedImage(imageUri);
  };

  const saveNoteHandler = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('輸入不完整', '請輸入標題和內容。');
      return;
    }

    dispatch(addNote({ title, content, imageUri: selectedImage }));
    navigation.goBack(); // 返回上一頁
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
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
        <View style={styles.buttonContainer}>
          <Button title="儲存筆記" onPress={saveNoteHandler} color="#6200ee" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 18,
  },
  textArea: {
      height: 150,
      textAlignVertical: 'top'
  },
  buttonContainer: {
      marginTop: 20,
  }
});

export default AddNoteScreen;