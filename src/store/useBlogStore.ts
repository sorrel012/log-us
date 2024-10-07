import { create } from 'zustand';

interface BlogState {
    blogId: string | null;
    setBlogId: (id: string) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
    blogId: null,
    setBlogId: (id: string) => set({ blogId: id }),
}));
