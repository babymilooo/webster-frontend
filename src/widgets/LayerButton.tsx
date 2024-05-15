import { useProjectStore } from '@/entities/project';
import Konva from 'konva';
import { FC } from 'react';

export const LayerButton: FC<{ layer: Konva.Layer; index?: number }> = ({
    layer,
    index,
}) => {
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    return (
        <div
            className={`grid h-20 w-full grid-cols-3   grid-rows-1 ${
                layer == selectedLayer ? 'bg-green-400' : ''
            }`}
            onClick={() => setSelectedLayer(layer)}
        >
            <span className="flex items-center justify-center align-middle">
                Layer {layer.getAttr('creationIndex')}
            </span>
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
