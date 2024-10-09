import {create} from "zustand";
import {createAuthSlice} from './slices/auth-slice.js';
import {createChatSlice} from "@/store/slices/chat-slice.js";

export const useAppStore = create()((...args) => ({
    ...createAuthSlice(...args),
    ...createChatSlice(...args),
}));