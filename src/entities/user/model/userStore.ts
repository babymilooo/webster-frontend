import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { getUser, loginUser, regUser, signUpGoogle } from '../index';
import { getProjects } from '../api/getProjects';
import { logoutUser } from '../api/logoutUser';
import { useProjectStore } from '@/entities/project';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';

export interface IProject {
    _id: string;
    title: string;
    projectJSON?: string;
    thumbbnail?: string;
    owner: string;
}

interface User {
    _id: number;
    userName: string;
    email: string;
    profilePicture: string;
    emailVerified: boolean;
    role: string;
}

interface IUserStoreData {
    user: User | null;
    isLoaded: boolean;
    isLogin: boolean;
    checked: boolean;
    projects: IProject[] | null;
}

interface IUserStoreActions {
    resetStore: VoidFunction;
    setProjects: (projects: [] | null) => void;
    setUser: (user: User | null) => void;
    loginUser: (email: string, password: string) => void;
    loginGoogle: () => void;
    registerUser: (email: string, password: string) => void;
    checkAuth: () => object | null;
    logoutUser: () => Promise<void>;
}

const initState = {
    user: null,
    isLoaded: false,
    isLogin: false,
    checked: false,
    projects: null,
};

export const useUserStore = create<IUserStoreData & IUserStoreActions>()(
    devtools(
        immer((set) => ({
            ...initState,
            resetStore: () => {
                set({ ...initState });
            },
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
                useUserStore.getState().checkAuth();
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

            logoutUser: async () => {
                try {
                    await logoutUser();
                    set({ user: null });
                    useUserStore.getState().resetStore();
                    useProjectStore.getState().resetStore();
                    useInitProjectStore.getState().resetStore();
                } catch (error) {
                    console.error(error);
                }
            },
        })),
    ),
);
