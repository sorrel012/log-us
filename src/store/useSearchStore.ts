import { create } from 'zustand';

interface SearchState {
    keyword: string | null;
    setKeyword: (keyword: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    keyword: null,
    setKeyword: (keyword: string) => set({ keyword }),
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
