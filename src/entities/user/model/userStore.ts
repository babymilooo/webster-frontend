import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { getUser, loginUser, regUser, signUpGoogle, logout } from '../index';

interface User {
    _id: number;
    userName: string;
    email: string;
    profilePicture: string;
    emailVerified: boolean;
    isRegisteredViaGoogle: boolean;
    role: string;
}

interface UserState {
    user: User | null;
    isLoaded: boolean;
    isLogin: boolean;
    checked: boolean;
    setUser: (user: User | null) => void;
    loginUser: (email: string, password: string) => void;
    loginGoogle: () => void;
    registerUser: (email: string, password: string) => void;
    checkAuth: () => object | null;
    logoutUser: () => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        immer((set) => ({
            user: null,
            isLoaded: false,
            isLogin: false,
            checked: false,
            setUser: (user) => set({ user }),
            loginUser: async (email, password) => {
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
                set({ isLoaded: true });
            },
            registerUser: async (email, password) => {
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
                set({ isLoaded: true });
            },
            checkAuth: async () => {
                try {
                    const response = await getUser();
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                    set({ isLoaded: true });
                    set({ checked: true });
                    return user;
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
                set({ checked: true });
                return null;
            },
            loginGoogle: async () => {
                try {
                    const response = await signUpGoogle();
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },
            
            logoutUser: async () => {
                try {
                    await logout();
                    set({ user: null, isLogin: false });
                } catch (error) {
                    console.error(error);
                }
            },
        })),
    ),
);
