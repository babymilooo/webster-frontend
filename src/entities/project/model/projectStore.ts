import Konva from 'konva';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createProject } from '../index';
import { setOffDragable, setOnDraggableLayer } from '../lib/setDragable';
import { saveProject } from '../api/saveProject';
import { useUserStore } from '@/entities/user';

interface Project {
    _id: string;
    title: string;
    width: number;
    height: number;
}

interface IBrushSettings {
    width: number;
    color: string;
    selectedBrush?: string | null;
}

interface IShapeSettings {
    fill: string;
    stroke: string;
    strokeWidth: number;
}

interface ITextSettings {
    fontSize: number;
    fontFamily: string;
    fill: string;
    stroke?: string;
    padding: number;
    align: string;
    fontStyle?: string;
    textDecoration?: string;
}

interface IProjectStoreState {
    project: Project | null;
    isLoaded: boolean;
    coolDown: boolean;
    state: string;
    drawState: string;

    stage: Konva.Stage | null;
    selectedLayer: Konva.Layer | null;
    changedLayersSwitch: boolean;
    updatePreview: boolean;
    selectedShape: Konva.Node | null;

    brushSettings: IBrushSettings;
    shapeSettings: IShapeSettings;
    textSettings: ITextSettings;
    selectedImage: string | null;
    selectedBackgroundImage: string | null;
}

interface IProjectStoreActions {
    resetStore: VoidFunction;
    setProject: (project: Project | null) => void;
    createProject: (title: string, width: number, height: number) => void;
    setState: (state: string) => void;
    setCoolDown: (state: boolean) => void;
    setDrawState: (state: string) => void;

    setStage: (stage: Konva.Stage) => void;

    setSelectredShape: (shape: Konva.Node | null) => void;
    setUpdatePreview: VoidFunction;
    setSelectredImage: (image: string | null) => void;
    setSelectedBackgroundImage: (image: string | null) => void;

    setSelectedLayer: (layer: Konva.Layer) => void;
    toggleLayersSwitch: VoidFunction;

    setBrushSettings: (settings: Partial<IBrushSettings>) => void;
    setShapeSettings: (settings: Partial<IShapeSettings>) => void;
    setTextSettings: (settings: Partial<ITextSettings>) => void;

    saveProject: VoidFunction;
}

const initState = {
    project: null,
    isLoaded: false,
    coolDown: false,
    state: 'Drag',
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

    shapeSettings: {
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 4,
    },
    textSettings: {
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#000000',
        stroke: '#ff0000',
        padding: 10,
        align: 'left',
        fontStyle: 'normal',
        textDecoration: 'none',
    },
};

export const useProjectStore = create<
    IProjectStoreState & IProjectStoreActions
>()(
    devtools(
        immer((set, getState) => ({
            ...initState,
            resetStore: () =>
                set((state) => ({ ...initState, project: state.project })),
            setCoolDown: (state) => set({ coolDown: state }),
            setProject: (project) => set({ project }),
            createProject: async (title) => {
                try {
                    const response = await createProject(title);
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
            setUpdatePreview: () => {
                set((state) => ({
                    updatePreview: !state.updatePreview,
                }));
                const isLogin = useUserStore.getState().isLogin;
                if (!isLogin) return;

                const stage = useProjectStore.getState().stage;
                const sendData = () => {
                    if (stage) {
                        saveProject(stage);
                    }
                };

                const isCooldown = useProjectStore.getState().coolDown;
                const setCoolDown = useProjectStore.getState().setCoolDown;
                if (!isCooldown) {
                    sendData();
                    setCoolDown(true);

                    setTimeout(() => {
                        setCoolDown(false);
                    }, 15000);
                }
            },

            setBrushSettings: (settings) =>
                set((state) => ({
                    brushSettings: { ...state.brushSettings, ...settings },
                })),
            setShapeSettings: (settings) =>
                set((state) => ({
                    shapeSettings: { ...state.shapeSettings, ...settings },
                })),
            setTextSettings: (settings) =>
                set((state) => ({
                    textSettings: { ...state.textSettings, ...settings },
                })),
            saveProject: () => {
                const stage = getState().stage;
                if (!stage) return;
                const isLogin = useUserStore.getState().isLogin;
                if (!isLogin) return;
                saveProject(stage);
            },
        })),
    ),
);
