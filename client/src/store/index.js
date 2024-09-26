import {create} from "zustand";
import {createAuthSlice} from './slices/auth-slice.js';

export const useAppStore = create()((...args) => ({
    ...createAuthSlice(...args),
}));