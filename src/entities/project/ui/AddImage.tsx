import React from 'react';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { clearAllSelection, useProjectStore } from '@/entities/project';

type AddImage = {
    stageRef: React.RefObject<Konva.Stage>;
};

export const AddImage: React.FC<AddImage> = ({ stageRef }) => {
    const state = useProjectStore((state) => state.state);
    const selectedImage = useProjectStore((state) => state.selectedImage);
    const stage = useProjectStore((state) => state.stage);

    useEffect(() => {
        if (!stageRef.current || state !== 'SelectImage' || !selectedImage)
            return;

        const layer = useProjectStore.getState().selectedLayer;
        if (!layer) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        // const stage = stageRef.current;

        // Create an HTMLImageElement to load the selected image
        const imageElement = new window.Image();
        imageElement.src = selectedImage;

        imageElement.onload = () => {
            // const workingSpace = document.getElementById(
            //     'workingSpace',
            // ) as HTMLDivElement;
            if (!stage) return;
            let correctedWidth = imageElement.width;
            let correctedHeight = imageElement.height;
            if (correctedHeight > stage.height() * stage.scaleY()) {
                const coef =
                    correctedHeight / (stage.height() * stage.scaleY());
                correctedHeight = correctedHeight / coef;
                correctedWidth = correctedWidth / coef;
            }

            if (correctedWidth > stage.width() * stage.scaleX()) {
                const coef = correctedWidth / (stage.width() * stage.scaleX());
                correctedHeight = correctedHeight / coef;
                correctedWidth = correctedWidth / coef;
            }
            const image = new Konva.Image({
                x: 0,
                y: 0,
                width: correctedWidth,
                height: correctedHeight,
                image: imageElement, // Pass the loaded image element
                draggable: true,
            });

            layer?.add(image);

            // Set the transformer to the image
            image.on('click tap', () => {
                clearAllSelection(stageRef.current);
                transformer.nodes([image]);
            });

            layer?.add(transformer);
            layer?.batchDraw(); // Use batchDraw to redraw the layer
        };
    }, [selectedImage, state]);

    return null;
};
