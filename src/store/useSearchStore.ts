import { create } from 'zustand';

interface SearchState {
    keyword: string | null;
    setKeyword: (keyword: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    keyword: null,
    setKeyword: (keyword: string) => set({ keyword }),
}));
