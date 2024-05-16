import React from 'react';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { clearAllSelection, useProjectStore } from '@/entities/project';

type AddImage = {
    stageRef: React.RefObject<Konva.Stage>;
};

export const AddImage: React.FC<AddImage> = ({ stageRef }) => {
    const state = useProjectStore((state) => state.state);
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    const selectedImage = useProjectStore((state) => state.SelectedImage);

    useEffect(() => {
        if (!stageRef.current || state !== 'SelectImage' || !selectedImage)
            return;

        const layer = useProjectStore.getState().selectedLayer;
        if (!layer) return;
        const transformer = layer.findOne(
            'Transformer',
        ) as Konva.Transformer;

        // const stage = stageRef.current;

        // Create an HTMLImageElement to load the selected image
        const imageElement = new window.Image();
        imageElement.src = selectedImage;

        imageElement.onload = () => {
            const image = new Konva.Image({
                x: 0,
                y: 0,
                image: imageElement, // Pass the loaded image element
                draggable: true,
            });

            selectedLayer?.add(image);

            // Set the transformer to the image
            image.on('click tap', () => {
                clearAllSelection(stageRef.current);
                transformer.nodes([image]);
            });

            selectedLayer?.add(transformer);
            selectedLayer?.batchDraw(); // Use batchDraw to redraw the layer
        };
    }, [selectedImage, state]);

    return null;
};
