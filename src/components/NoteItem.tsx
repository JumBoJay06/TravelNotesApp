import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Note } from '../redux/notesSlice';

interface NoteItemProps {
    note: Note;
    onPress: () => void;
}

const NoteItem = ({ note, onPress }: NoteItemProps) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            {note.imageUris && note.imageUris.length > 0 && (
                <Image source={{ uri: note.imageUris[0] }} style={styles.image} />
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.dateText}>
                    {new Date(note.date).toLocaleDateString()}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        margin: 8,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 1,
    },
    infoContainer: {
        margin: 8,
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