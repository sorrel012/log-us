import { create } from 'zustand';

interface SearchState {
    keyword: string | null;
    setKeyword: (keyword: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    blogKeyword: string | null;
    setBlogKeyword: (blogKeyword: string) => void;
    isBlogOpen: boolean;
    setIsBlogOpen: (isBlogOpen: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    keyword: null,
    setKeyword: (keyword: string) => set({ keyword }),
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    blogKeyword: null,
    setBlogKeyword: (blogKeyword: string) => set({ blogKeyword }),
    isBlogOpen: false,
    setIsBlogOpen: (isBlogOpen: boolean) => set({ isBlogOpen }),
}));
