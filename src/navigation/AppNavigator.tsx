import React from 'react';
import { Platform, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteListScreen from '../screens/NoteListScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';

// 定義導覽器的參數型別
export type RootStackParamList = {
    NoteList: undefined; // 列表頁不需要參數
    AddNote: { noteId?: string };  // 新增頁不需要參數
    NoteDetail: { noteId: string }; // 細節頁需要傳入 noteId
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
                        name="AddNote"
                        component={AddNoteScreen}
                        options={{ title: '新增筆記' }}
                    />
                    <Stack.Screen
                        name="NoteDetail"
                        component={NoteDetailScreen}
                        options={{ title: '筆記詳情' }}
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