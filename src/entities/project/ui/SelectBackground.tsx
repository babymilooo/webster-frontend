import { FC, useEffect } from 'react';
import { useProjectStore } from '../model/projectStore';
import Konva from 'konva';

let backgroundLayer: Konva.Layer | null = null;

export function setBackgroundLayer(layer: Konva.Layer) {
    backgroundLayer = layer;
    return backgroundLayer;
}

export const SelectBackground: FC = () => {
    const state = useProjectStore((state) => state.state);
    const selectedBackground = useProjectStore(
        (state) => state.selectedBackgroundImage,
    );

    useEffect(() => {
        const stage = useProjectStore.getState().stage;
        if (state !== 'SelectBackground' || !stage || !selectedBackground)
            return;
        if (!backgroundLayer) {
            backgroundLayer = new Konva.Layer();
            backgroundLayer.setAttrs({
                creationIndex: -2,
                hidden: true,
                backgroundLayer: true,
                listening: false,
                id: 'backgroundLayer',
            });
            stage.add(backgroundLayer);
        }
        backgroundLayer.moveToBottom();

        const images = backgroundLayer.find('Image');
        console.log(images);

        for (const image of images) {
            image.destroy();
        }

        const imgElement = new window.Image();
        // if (!imgElement) return;
        imgElement.src = selectedBackground;
        // console.log(selectedBackground);
        imgElement.onload = () => {
            const image = new Konva.Image({
                image: imgElement,
                draggable: false,
                width: stage.width(),
                height: stage.height(),
                x: 0,
                y: 0,
            });
            image.setAttrs({ handdrawn: true });
            backgroundLayer?.add(image);
            backgroundLayer?.batchDraw();
        };
    }, [state, selectedBackground]);

    return null;
};
