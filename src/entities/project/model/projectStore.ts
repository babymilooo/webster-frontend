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

interface ProjectState {
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
}

export const useProjectStore = create<ProjectState>()(
    devtools(
        immer((set) => ({
            project: null,
            isLoaded: false,
            coolDown: false,
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

                const stage = useProjectStore.getState().stage;
                const sendData = () => {
                    if (stage) {
                        const dataURL = stage.toDataURL({ pixelRatio: 3 });
                        console.log(dataURL);
                        // Отправка данных на сервер
                        // fetch('/api/upload', {
                        //     method: 'POST',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //     },
                        //     body: JSON.stringify({ image: dataURL }),
                        // })
                        //     .then((response) => response.json())
                        //     .then((data) => console.log('Success:', data))
                        //     .catch((error) => console.error('Error:', error));
                    }
                };

                let isCooldown = useProjectStore.getState().coolDown;
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
        })),
    ),
);
