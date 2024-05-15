import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { createProject } from '../index';

interface Project {
    _id: number;
    title: string;
    width: number;
    height: number;
}

interface ProjectState {
    project: Project | null;
    isLoaded: boolean;
    state: string;
    setProject: (project: Project | null) => void;
    createProject: (title: string, width: number, height: number) => void;
    setState: (state: string) => void;
}

export const useProjectStore = create<ProjectState>()(
    devtools(
        immer((set) => ({
            project: null,
            isLoaded: false,
            state: '',
            setProject: (project) => set({ project }),
            createProject: async (title, width, height) => {
                try {
                    const response = await createProject(title, width, height);
                    const project = response;
                    if (project) {
                        set({ project });
                    }
                } catch (error) {
                    console.error(error);
                }
                set({ isLoaded: true });
            },
            setState: (state) => set({ state }),
        }))
    )
);
