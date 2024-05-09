import { create } from 'zustand';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    loginUser: (email: string, password: string) => void;
    logoutUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    setUser: (user) => set({ user }),
    loginUser: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/users',
            );
            const users = await response.json();
            const user = users.find((user: User) => user.email === email);
            if (user) {
                set({ user });
            }
        } catch (error) {
            console.error(error);
        }
        set({ isLoading: false });
    },
    logoutUser: () => set({ user: null }),
}));
