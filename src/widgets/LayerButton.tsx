import { useProjectStore } from '@/entities/project';
import Konva from 'konva';
import { FC } from 'react';

export const LayerButton: FC<{ layer: Konva.Layer; index: number }> = ({
    layer,
    index,
}) => {
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );
    return (
        <div className="h-20 w-40 grid-cols-3 grid-rows-1 items-center justify-items-center gap-1">
            <div>Layer {layer.getAttr('creationIndex')}</div>
            <button
                type="button"
                onClick={() => {
                    layer.moveUp();
                    toggleLayersSwitch();
                }}
            >
                Up
            </button>
            <button
                type="button"
                onClick={() => {
                    layer.moveDown();
                    toggleLayersSwitch();
                }}
            >
                Down
            </button>
        </div>
    );
};
