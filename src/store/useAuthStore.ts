import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    loginUser: number | null;
    loginUserNickname: string | null;
    loginImgUrl: string | null;
    loginBlogAddress: string | null;
    setAuthInfo: (
        loginUser: number | null,
        loginUserNickname: string | null,
        loginImgUrl: string | null,
        loginBlogAddress: string | null,
    ) => void;
    clearAuthInfo: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            loginUser: null,
            loginUserNickname: null,
            loginImgUrl: null,
            loginBlogAddress: null,
            setAuthInfo: (
                loginUser,
                loginUserNickname,
                loginImgUrl,
                loginBlogAddress,
            ) =>
                set({
                    loginUser,
                    loginUserNickname,
                    loginImgUrl,
                    loginBlogAddress,
                }),
            clearAuthInfo: () =>
                set({
                    loginUser: null,
                    loginUserNickname: null,
                    loginImgUrl: null,
                    loginBlogAddress: null,
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
