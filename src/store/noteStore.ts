import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { produce } from 'immer';
import { nanoid } from 'nanoid/non-secure'

// 定義單一筆記的資料結構
export interface Note {
    id: string;
    title: string;
    content: string;
    imageUris: string[]; // 圖片的 URI 陣列
    date: string;
    coord?: Coord;
}

export interface Coord {
    name: String;
    latitude: number;  // 緯度
    longitude: number; // 經度
}

// 定義 Zustand store 的狀態和操作的結構
interface NotesState {
    notes: Note[]; // 存放所有筆記的陣列
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // 異步操作的狀態，用於追蹤載入進度
    error: string | null; // 存放異步操作可能發生的錯誤訊息
    loadNotes: () => Promise<void>; // 從 AsyncStorage 載入筆記的函數
    saveNotes: () => Promise<void>; // 將筆記儲存到 AsyncStorage 的函數
    addNote: (note: Omit<Note, 'id' | 'date'>) => void; // 新增一筆筆記的函數
    updateNote: (note: Omit<Note, 'date'>) => void; // 更新現有筆記的函數
    deleteNote: (noteId: string) => void; // 根據 ID 刪除一筆筆記的函數
}

const NOTES_STORAGE_KEY = 'MyTravelNotes';

// 使用 create 函數來建立我們的 Zustand Store
// set 用於更新狀態，get 用於讀取當前狀態
export const useNoteStore = create<NotesState>((set, get) => ({
    // 初始狀態
    notes: [], // 筆記陣列初始化為空
    status: 'idle', // 初始狀態為閒置
    error: null, // 初始沒有錯誤

    // 定義從 AsyncStorage 載入筆記的異步函數
    loadNotes: async () => {
        set({ status: 'loading' }); // 開始載入時，將狀態設為 'loading'
        try {
            const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY); // 從 AsyncStorage 讀取資料
            // 如果讀取到資料，就將其解析為 JSON 物件；否則返回空陣列
            const notes = jsonValue != null ? JSON.parse(jsonValue) : [];
            set({ notes, status: 'succeeded' }); // 成功載入後，更新筆記資料並將狀態設為 'succeeded'
        } catch (e) {
            console.error('Failed to load notes.', e); // 如果出錯，在控制台打印錯誤
            set({ status: 'failed', error: 'Failed to load notes' }); // 將狀態設為 'failed' 並記錄錯誤訊息
        }
    },

    // 定義將筆記儲存到 AsyncStorage 的異步函數
    saveNotes: async () => {
        try {
            const notes = get().notes; // 使用 get() 獲取當前的筆記陣列
            const jsonValue = JSON.stringify(notes); // 將筆記陣列轉換為 JSON 字串
            await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue); // 將 JSON 字串儲存到 AsyncStorage
        } catch (e) {
            console.error('Failed to save notes.', e); // 如果出錯，在控制台打印錯誤
        }
    },

    // 新增一筆筆記
    // 使用 immer 的 produce 來處理狀態更新，可以讓我們用類似直接修改的方式來更新狀態，而不會真的改變到原始狀態
    addNote: (note) =>
        set(produce((state: NotesState) => {
            // 建立一筆新的筆記物件
            const newNote: Note = {
                id: nanoid(), // 唯一 ID
                date: new Date().toISOString(), // 使用當前時間的 ISO 字串作為日期
                ...note, // 展開傳入的筆記資料 (標題、內容、圖片)
            };
            state.notes.unshift(newNote); // 將新筆記加到陣列的最前面
        })),

    // 更新一筆現有的筆記
    updateNote: (note) =>
        set(produce((state: NotesState) => {
            // 找到要更新的筆記在陣列中的索引
            const index = state.notes.findIndex((n) => n.id === note.id);
            if (index !== -1) { // 如果找到了
                // 更新該筆記的資料
                state.notes[index] = {
                    ...state.notes[index], // 保留舊有的資料
                    ...note, // 用新的資料覆蓋
                    date: new Date().toISOString(), // 更新修改日期
                };
            }
        })),

    // 根據 ID 刪除一筆筆記
    deleteNote: (noteId) =>
        set(produce((state: NotesState) => {
            // 使用 filter 方法回傳一個不包含被刪除筆記的新陣列
            state.notes = state.notes.filter((note) => note.id !== noteId);
        })),
}));