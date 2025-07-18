import React from 'react';
import { Platform, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteListScreen from '../screens/NoteListScreen';
import NoteAddEditScreen from '../screens/NoteAddEditScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import MapScreen from '../screens/MapScreen';
import { Coord } from '../store/noteStore';

// 定義導覽器的參數型別
export type RootStackParamList = {
    NoteList: undefined; // 列表頁不需要參數
    NoteAddEditor: { 
        noteId?: string;
        pickedLocation?: Coord; 
    };  // 編輯頁，noteId 是可選的
    NoteDetail: { noteId: string }; // 細節頁需要傳入 noteId
    Map: { // Map 頁面的參數
        noteId?: string; // 回傳用的
        initialLocation?: Coord;
    };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer>
                <StatusBar barStyle="light-content" />
                <Stack.Navigator
                    id={undefined}
                    initialRouteName="NoteList"
                    screenOptions={{
                        headerStyle: { backgroundColor: '#007cdb' },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
                        ...Platform.select({
                            ios: {
                                headerTitleAlign: 'center',
                            },
                            android: {
                                headerTitleAlign: 'left',
                            },
                        }),

                    }}
                >
                    <Stack.Screen
                        name="NoteList"
                        component={NoteListScreen}
                        options={{ title: '旅遊筆記列表' }}
                    />
                    <Stack.Screen
                        name="NoteAddEditor"
                        component={NoteAddEditScreen}
                        // 標題將由 NoteEditorScreen 動態設定
                    />
                    <Stack.Screen
                        name="NoteDetail"
                        component={NoteDetailScreen}
                        options={{ title: '筆記詳情' }}
                    />
                    <Stack.Screen // 新增 Map 頁面
                        name="Map"
                        component={MapScreen}
                        options={{ title: '選擇地點' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007cdb',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
});

export default AppNavigator;