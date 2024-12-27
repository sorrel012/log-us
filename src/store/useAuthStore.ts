import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    loginUser: number | null;
    loginUserNickname: string | null;
    loginBlogAddress: string | null;
    loginEmail: string | null;
    loginImgUrl: string | null;
    setAuthInfo: (
        loginUser: number | null,
        loginUserNickname: string | null,
        loginBlogAddress: string | null,
        loginEmail: string | null,
        loginImgUrl?: string | null,
    ) => void;
    clearAuthInfo: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            loginUser: null,
            loginUserNickname: null,
            loginBlogAddress: null,
            loginEmail: null,
            loginImgUrl: null,
            setAuthInfo: (
                loginUser,
                loginUserNickname,
                loginBlogAddress,
                loginEmail,
                loginImgUrl,
            ) =>
                set({
                    loginUser,
                    loginUserNickname,
                    loginBlogAddress,
                    loginEmail,
                    loginImgUrl,
                }),
            clearAuthInfo: () =>
                set({
                    loginUser: null,
                    loginUserNickname: null,
                    loginBlogAddress: null,
                    loginEmail: null,
                    loginImgUrl: null,
                }),
        }),
        {
            name: 'auth',
            getStorage: () => {
                return localStorage;
            },
        },
    ),
);