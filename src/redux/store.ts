import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';

export const store = configureStore({
    reducer: {
        notes: notesReducer,
    },
});

// 定義 RootState 和 AppDispatch 的型別，方便在應用程式中使用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;