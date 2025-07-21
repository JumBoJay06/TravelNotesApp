import React, { useState, useCallback, useLayoutEffect, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, TextInput, Keyboard } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import { RootStackParamList } from '../navigation/AppNavigator';
import { fetchGoogleApi } from '../api/GoogleApis';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

interface Props {
    navigation: MapScreenNavigationProp;
    route: MapScreenRouteProp;
}

// Delta 地圖的可視範圍大小
const INITIAL_LATITUDE_DELTA = 0.0922;
const INITIAL_LONGITUDE_DELTA = 0.0421;
const DEFAULT_LATITUDE = 22.6282173;
const DEFAULT_LONGITUDE = 120.293041;

const MapScreen = ({ navigation, route }: Props) => {
    const noteId = route.params?.noteId;
    const initialLocation = route.params?.initialLocation;
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef<MapView>(null);

    const initRegion = {
        latitude: initialLocation?.latitude || DEFAULT_LATITUDE,
        longitude: initialLocation?.longitude || DEFAULT_LONGITUDE,
        latitudeDelta: INITIAL_LATITUDE_DELTA,
        longitudeDelta: INITIAL_LONGITUDE_DELTA,
    };

    // 自動取得目前位置
    useEffect(() => {
        (async () => {
            if (initialLocation) return; // 如果有初始位置，則不自動定位

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('權限不足', '無法取得您目前的位置資訊！');
                return;
            }

            let location = await Location.getCurrentPositionAsync({}); 
            const currentLocation = {
                name: `(${location.coords.latitude}, ${location.coords.longitude})`,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }
            setSelectedLocation(currentLocation);
            // 將地圖中心移動到目前位置
            mapRef.current?.animateToRegion({
                ...initRegion,
                ...currentLocation,
            });
        })();
    }, []);

    const selectLocationHandler = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const name = `(${latitude}, ${longitude})`;
        setSelectedLocation({ name,latitude, longitude });
    };

    const savePickedLocationHandler = useCallback(() => {
        // 這裡使用了 navigation 物件
        navigation.popTo('NoteAddEditor', {
            noteId: noteId, // 這裡使用了 noteId
            pickedLocation: selectedLocation // 這裡使用了 selectedLocation
        });
    }, [navigation, selectedLocation, noteId]);

    const handleSearch = async () => {
        Keyboard.dismiss();
        if (!searchQuery.trim()) return;
        try {
            const data = await fetchGoogleApi(searchQuery);
            if (data.status === 'OK' && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                const newLocation = { name: searchQuery, latitude: lat, longitude: lng };
                setSelectedLocation(newLocation);
                mapRef.current?.animateToRegion({
                    ...initRegion,
                    ...newLocation,
                });
            } else {
                Alert.alert('找不到地點', '請嘗試不同的關鍵字。');
            }
        } catch (error) {
            Alert.alert('發生錯誤', '無法搜尋地點，請稍後再試。');
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={savePickedLocationHandler}>
                    <Text style={styles.headerButtonText}>儲存</Text>
                </Pressable>
            ),
        });
    }, [navigation, savePickedLocationHandler]);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="搜尋地點..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>搜尋</Text>
                </Pressable>
            </View>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initRegion}
                onPress={selectLocationHandler}
            >
                {selectedLocation && (
                    <Marker
                        title="選擇的地點"
                        coordinate={selectedLocation}
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#f0f0f0',
    },
    searchInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#fff',
    },
    searchButton: {
        marginLeft: 8,
        backgroundColor: '#007cdb',
        paddingHorizontal: 12,
        justifyContent: 'center',
        borderRadius: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    },
    headerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 16,
    },
});

export default MapScreen;