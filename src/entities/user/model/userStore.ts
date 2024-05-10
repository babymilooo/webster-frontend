import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { getUser, loginUser, regUser } from '../index';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    isLogin: boolean;
    setUser: (user: User | null) => void;
    loginUser: (email: string, password: string) => void;
    registerUser: (email: string, password: string) => void;
    checkAuth: () => void;
    logoutUser: () => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        immer((set) => ({
            user: null,
            isLoading: false,
            isLogin: false,
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
                } catch (error) {
                    console.error(error);
                }
                set({ isLoading: false });
            },

            logoutUser: () => set({ user: null }),
        })),
    ),
);
