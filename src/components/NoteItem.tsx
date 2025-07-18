import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Note } from '../store/noteStore';

interface NoteItemProps {
    note: Note;
    onPress: () => void;
}

const NoteItem = ({ note, onPress }: NoteItemProps) => {
    const hasMapMarker = note.coord;
    return (
        <Pressable style={styles.container} onPress={onPress}>
            {note.imageUris && note.imageUris.length > 0 && (
                <Image source={{ uri: note.imageUris[0] }} style={styles.image} />
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {note.title}
                </Text>
                <Text style={styles.dateText}>
                    {new Date(note.date).toLocaleDateString()}
                </Text>
            </View>
            {hasMapMarker && <View style={styles.hasMapMarkerContainer}>
                <FontAwesome5 name="map-marked-alt" size={24} color="#007cdb" />
            </View>}

        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
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
        flex: 1,
        padding: 8,
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
    hasMapMarkerContainer: {
        padding: 8
    },
});

export default NoteItem;