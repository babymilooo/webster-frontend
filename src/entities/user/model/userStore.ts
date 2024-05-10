import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { getUser, loginUser, regUser } from '../index';

interface User {
    _id: number;
    userName: string;
    email: string;
    profilePicture: string;
    emailVerified: boolean;
    role: string;
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    isLogin: boolean;
    checked: boolean;
    setUser: (user: User | null) => void;
    loginUser: (email: string, password: string) => void;
    registerUser: (email: string, password: string) => void;
    checkAuth: () => object | null;
    logoutUser: () => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        immer((set) => ({
            user: null,
            isLoading: false,
            isLogin: false,
            checked: false,
            setUser: (user) => set({ user }),
            loginUser: async (email, password) => {
                set({ isLoading: true });
                try {
                    const response = await loginUser(email, password);
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoading: false });
            },
            registerUser: async (email, password) => {
                set({ isLoading: true });
                try {
                    const response = await regUser(email, password);
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoading: false });
            },
            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const response = await getUser();
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                    set({ checked: true });
                    return user;
                } catch (error) {
                    console.error(error);
                }
                set({ isLoading: false });
                set({ checked: true });
                return null;
            },

            logoutUser: () => set({ user: null }),
        })),
    ),
);
