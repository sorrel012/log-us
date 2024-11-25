import { create } from 'zustand';
import { Member } from '@/components/sidebar/UserProfile';

export interface BlogInfo {
    shareYn: string;
    blogName: string;
    blogAddress: string;
    introduce?: string;
    members: Member[];
}

interface BlogState {
    blogId: string | null;
    setBlogId: (id: string) => void;
    blogInfo: BlogInfo;
    setBlogInfo: (info: BlogInfo) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
    blogId: null,
    setBlogId: (id: string) => set({ blogId: id }),
    blogInfo: null,
    setBlogInfo: (info: BlogInfo) =>
        set((state) => ({ ...state, blogInfo: info })),
}));
