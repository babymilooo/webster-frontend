import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { createProject } from '../index';
import Konva from 'konva';

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
    stage: Konva.Stage | null;
    selectedLayer: Konva.Layer | null;
    changedLayersSwitch: boolean;
    setProject: (project: Project | null) => void;
    createProject: (title: string, width: number, height: number) => void;
    setState: (state: string) => void;
    setStage: (stage: Konva.Stage) => void;
    setSelectedLayer: (layer: Konva.Layer) => void;
    toggleLayersSwitch: VoidFunction;
}

export const useProjectStore = create<ProjectState>()(
    devtools(
        immer((set) => ({
            project: null,
            isLoaded: false,
            state: '',
            stage: null,
            selectedLayer: null,
            changedLayersSwitch: false,
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
            setStage: (stage) => set({ stage }),
            setSelectedLayer: (layer) => set({ selectedLayer: layer }),
            toggleLayersSwitch: () =>
                set((state) => ({
                    changedLayersSwitch: !state.changedLayersSwitch,
                })),
        })),
    ),
);
