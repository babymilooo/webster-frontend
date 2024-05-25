import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { getUser, loginUser, regUser, signUpGoogle } from '../index';
import { getProjects } from '../api/getProjects';

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
    isLoaded: boolean;
    isLogin: boolean;
    checked: boolean;
    projects: [] | null;
    setProjects: (projects: [] | null) => void;
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
            projects: null,
            setProjects: (projects) => set({ projects }),
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
                    const projects = await getProjects();
                    const user = response;
                    if (user) {
                        set({ user });
                        set({ isLogin: true });
                    }
                    set({ isLoaded: true });
                    set({ checked: true });
                    set({ projects });
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
            
            logoutUser: () => set({ user: null }),
        })),
    ),
);
