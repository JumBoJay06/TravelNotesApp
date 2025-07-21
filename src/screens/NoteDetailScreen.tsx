import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Alert, FlatList, Dimensions, Platform, Linking } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNoteStore } from '../store/noteStore';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

type NoteDetailScreenRouteProp = RouteProp<RootStackParamList, 'NoteDetail'>;
type NoteDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteDetail'>;

interface Props {
    route: NoteDetailScreenRouteProp;
    navigation: NoteDetailScreenNavigationProp;
}

// 讓圖片寬度跟手機寬度一致
const { width } = Dimensions.get('window');

const NoteDetailScreen = ({ route, navigation }: Props) => {
    const { noteId } = route.params;
    const { notes, deleteNote } = useNoteStore();

    const note = notes.find((n) => n.id === noteId);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={deleteHandler} style={styles.deleteIcon}>
                    <MaterialCommunityIcons name='delete-forever' size={28} color='#fff' />
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
                        deleteNote(noteId);
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const editHandle = () => {
        navigation.navigate('NoteAddEditor', { noteId });
    };

    const openMapHandler = () => {
        if (note?.coord) {
            const location = note.coord;
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${location.latitude},${location.longitude}`;
            const label = location.name;
            const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });
            if (url) Linking.openURL(url);
        }
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
                {note.imageUris && note.imageUris.length > 0 && (
                     <FlatList
                        data={note.imageUris}
                        horizontal={true}
                        pagingEnabled={true}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.image} />
                        )}
                        showsHorizontalScrollIndicator={true}
                    />
                )}
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{note.title}</Text>
                    <Text style={styles.date}>
                        {new Date(note.date).toLocaleString()}
                    </Text>
                    {note.coord && (
                        <View style={styles.coordContainer}>
                        <Text style={styles.coordText}  numberOfLines={3} ellipsizeMode="tail">地點：{note.coord.name}</Text>
                        <Pressable style={styles.mapButton} onPress={openMapHandler}>
                            <FontAwesome5 name="map-marked-alt" size={24} color="#007cdb" />
                        </Pressable>
                        </View>
                    
                    )}
                    <Text style={styles.content}>{note.content}</Text>

                </View>
            </ScrollView>
            <Pressable style={styles.editButton} onPress={editHandle}>
                <Text style={styles.editButtonText}>編輯筆記</Text>
            </Pressable>
        </View>

    );
};

const styles = StyleSheet.create({
    image: {
        width: width,
        height: 250,
        marginBottom: 8,
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
        marginBottom: 8,
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
    coordContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coordText: {
        fontSize: 16,
        textAlign: 'center',
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
    deleteIcon: {
        paddingVertical: 10,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapButton: {
        padding: 8,
        alignItems: 'center',
    },
    mapButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NoteDetailScreen;