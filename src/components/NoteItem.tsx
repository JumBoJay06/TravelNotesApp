import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Note } from '../redux/notesSlice';

interface NoteItemProps {
  note: Note;
  onPress: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {note.imageUri && (
        <Image source={{ uri: note.imageUri }} style={styles.image} />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.dateText}>
          {new Date(note.date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});

export default NoteItem;