import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteListScreen from '../screens/NoteListScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import { Note } from '../redux/notesSlice';

// 定義導覽器的參數型別
export type RootStackParamList = {
    NoteList: undefined; // 列表頁不需要參數
    AddNote: undefined;  // 新增頁不需要參數
    NoteDetail: { noteId: string }; // 細節頁需要傳入 noteId
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                id={undefined}
                initialRouteName="NoteList"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#333',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
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
    );
};

export default AppNavigator;