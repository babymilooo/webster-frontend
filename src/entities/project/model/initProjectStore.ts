import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface IInitProjectStoreState {
    width: number;
    height: number;
    serializedJSON: string | null;
    startingImage: string | null;
    startingBackgroundImage: string | null;
}

interface IInitProjectActions {
    resetStore: VoidFunction;
    setSerializedJSON: (json: string | null) => void;
    setStartingImage: (image: string | null) => void;
    setStartingBackgroundImage: (image: string | null) => void;
}

const initState = {
    width: 640,
    height: 480,
    serializedJSON: null,
    startingImage: null,
    startingBackgroundImage: null,
};

export const useInitProjectStore = create<
    IInitProjectStoreState & IInitProjectActions
>()(
    devtools(
        immer((set, get) => ({
            ...initState,
            resetStore: () => {
                set(initState);
            },
            setSerializedJSON: (json) => {
                set({ serializedJSON: json });
            },
            setStartingImage: (image) => {
                set({ startingImage: image });
            },
            setStartingBackgroundImage: (image) => {
                set({ startingBackgroundImage: image });
            },
        })),
    ),
);
