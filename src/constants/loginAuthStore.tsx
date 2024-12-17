import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    userId: string | null;
    isAdmin : boolean | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuthInfo: (userId: string, isAdmin : boolean, accessToken: string, refreshToken: string) => void;
    clearAuthInfo: () => void;
}

export const loginAuthStore = create<AuthState>()(
    persist(
    (set) => ({
        userId: null,
        isAdmin : null,
        accessToken: null,
        refreshToken: null,
        setAuthInfo: (userId, isAdmin, accessToken, refreshToken) => 
            set({ userId, isAdmin, accessToken, refreshToken }),
        clearAuthInfo: () => set({ userId: null, isAdmin : null, accessToken: null, refreshToken: null }),
    }),
    {
        name: 'auth-storage', // 저장소 이름
        getStorage: () => localStorage, // localStorage에 저장
    }
    )
);