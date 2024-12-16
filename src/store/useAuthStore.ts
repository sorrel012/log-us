import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    loginUser: number | null;
    loginUserNickname: string | null;
    isAdmin: boolean;
    accessToken: string | null;
    setAuthInfo: (
        loginUser: number | null,
        loginUserNickname: string | null,
        isAdmin: boolean,
        accessToken: string | null,
    ) => void;
    clearAuthInfo: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            loginUser: null,
            loginUserNickname: null,
            isAdmin: false,
            accessToken: null,
            setAuthInfo: (loginUser, loginUserNickname, isAdmin, accessToken) =>
                set({ loginUser, loginUserNickname, isAdmin, accessToken }),
            clearAuthInfo: () =>
                set({
                    loginUser: null,
                    loginUserNickname: null,
                    isAdmin: false,
                    accessToken: null,
                }),
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        },
    ),
);
