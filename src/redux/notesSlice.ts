import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定義單一筆記的資料結構
export interface Note {
  id: string;
  title: string;
  content: string;
  imageUri: string | null; // 圖片的 URI
  date: string;
}

// 定義 notes slice 的狀態結構
interface NotesState {
  notes: Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // 異步操作的狀態
  error: string | null;
}

// 初始狀態
const initialState: NotesState = {
  notes: [],
  status: 'idle',
  error: null,
};

const NOTES_STORAGE_KEY = 'MyTravelNotes';

// 異步 Thunk：從 AsyncStorage 載入筆記
export const loadNotesAsync = createAsyncThunk('notes/loadNotes', async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load notes.', e);
    return [];
  }
});

// 異步 Thunk：將筆記儲存到 AsyncStorage
export const saveNotesAsync = createAsyncThunk('notes/saveNotes', async (notes: Note[]) => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save notes.', e);
  }
});

// 建立 Redux Slice
const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // 新增一筆筆記
    addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'date'>>) => {
      const newNote: Note = {
        id: new Date().getTime().toString(), // 使用時間戳作為唯一 ID
        date: new Date().toISOString(),
        ...action.payload,
      };
      state.notes.unshift(newNote); // 將新筆記加到最前面
    },
    // 刪除一筆筆記
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
  },
  // 處理異步 Thunk 的 Reducers
  extraReducers: (builder) => {
    builder
      .addCase(loadNotesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadNotesAsync.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.status = 'succeeded';
        state.notes = action.payload;
      })
      .addCase(loadNotesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load notes';
      });
  },
});

export const { addNote, deleteNote } = notesSlice.actions;

export default notesSlice.reducer;