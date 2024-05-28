import React from 'react';
import Konva from 'konva';
import { useEffect } from 'react';
import { clearAllSelection, useProjectStore } from '@/entities/project';

type AddImage = {
    stageRef: React.RefObject<Konva.Stage>;
};

export const AddImage: React.FC<AddImage> = ({ stageRef }) => {
    const state = useProjectStore((state) => state.state);
    const selectedImage = useProjectStore((state) => state.selectedImage);
    const stage = useProjectStore((state) => state.stage);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);

    useEffect(() => {
        if (!stageRef.current || state !== 'SelectImage' || !selectedImage)
            return;

        const layer = useProjectStore.getState().selectedLayer;
        if (!layer) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const imageElement = new window.Image();
        imageElement.crossOrigin = 'anonymous';
        if (typeof selectedImage === 'string') {
            imageElement.src = selectedImage;
        } else {
            imageElement.src = (selectedImage as unknown as any).image;
        }
        // imageElement.src = (
        //     selectedImage as unknown as { image: string }
        // ).image;

        imageElement.onload = () => {
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
                image: imageElement,
                draggable: true,
            });
            image.addName('selectable');

            image.setAttrs({ src: imageElement.src });

            layer?.add(image);

            image.on('click tap', () => {
                clearAllSelection(stageRef.current);
                transformer.nodes([image]);
            });

            layer?.add(transformer);
            layer?.batchDraw();
            setUpdatePreview();
        };
    }, [selectedImage, state]);

    return null;
};
