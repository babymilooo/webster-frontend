import Konva from 'konva';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createProject } from '../index';
import { setOffDragable, setOnDraggableLayer } from '../lib/setDragable';

interface Project {
    _id: number;
    title: string;
    width: number;
    height: number;
}

interface IBrushSettings {
    width: number;
    color: string;
    selectedBrush?: string | null;
}

interface ProjectState {
    project: Project | null;
    isLoaded: boolean;

    state: string;
    drawState: string;

    stage: Konva.Stage | null;
    selectedLayer: Konva.Layer | null;
    changedLayersSwitch: boolean;
    updatePreview: boolean;
    selectedShape: Konva.Node | null;

    brushSettings: IBrushSettings;
    selectedImage: string | null;
    selectedBackgroundImage: string | null;

    selectedFill: string;
    selectedStroke: string;

    setSelectedFill: (fill: string) => void;
    setSelectedStroke: (stroke: string) => void;

    setProject: (project: Project | null) => void;
    createProject: (title: string, width: number, height: number) => void;
    setState: (state: string) => void;
    setDrawState: (state: string) => void;

    setStage: (stage: Konva.Stage) => void;

    setSelectredShape: (shape: Konva.Node | null) => void;
    setUpdatePreview: VoidFunction;
    setSelectredImage: (image: string | null) => void;
    setSelectedBackgroundImage: (image: string | null) => void;

    setSelectedLayer: (layer: Konva.Layer) => void;
    toggleLayersSwitch: VoidFunction;

    setBrushSettings: (settings: Partial<IBrushSettings>) => void;
}

export const useProjectStore = create<ProjectState>()(
    devtools(
        immer((set) => ({
            project: null,
            isLoaded: false,

            state: '',
            drawState: '',

            stage: null,
            selectedLayer: null,
            changedLayersSwitch: false,

            selectedImage: null,
            selectedBackgroundImage: null,
            selectedShape: null,
            updatePreview: false,

            brushSettings: {
                width: 10,
                color: '#000000',
                selectedBrush: null,
            },

            selectedFill: '#000000',
            selectedStroke: '',

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
            setDrawState: (state) => set({ drawState: state }),

            setStage: (stage) => set({ stage }),
            setSelectedLayer: (layer) => {
                setOffDragable();
                setOnDraggableLayer(layer);

                set((state) => {
                    return {
                        selectedLayer: layer,
                        changedLayersSwitch: !state.changedLayersSwitch,
                    };
                });
            },
            toggleLayersSwitch: () =>
                set((state) => ({
                    changedLayersSwitch: !state.changedLayersSwitch,
                })),

            setSelectredShape: (shape) => set({ selectedShape: shape }),
            setSelectredImage: (image) => set({ selectedImage: image }),
            setSelectedBackgroundImage: (image) =>
                set({ selectedBackgroundImage: image }),
            setUpdatePreview: () =>
                set((state) => ({
                    updatePreview: !state.updatePreview,
                })),

            setBrushSettings: (settings) => {
                set((state) => ({
                    brushSettings: { ...state.brushSettings, ...settings },
                }));
            },
            setSelectedFill: (fill) => set({ selectedFill: fill }),
            setSelectedStroke: (stroke) => set({ selectedStroke: stroke }),
        })),
    ),
);
