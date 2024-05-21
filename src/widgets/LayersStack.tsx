import { useProjectStore } from '@/entities/project';
import { FC, useMemo } from 'react';
import { LayerButton } from './LayerButton';
import Konva from 'konva';
import { getLayerCreationIndex } from '@/entities/project/lib/layerCreationIndex';

export const LayersStack: FC = () => {
    const stage = useProjectStore((state) => state.stage);
    const layersSwitch = useProjectStore((state) => state.changedLayersSwitch);
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );
    const layers = useMemo(
        () =>
            stage
                ?.getLayers()
                .toSorted((a, b) => b.getZIndex() - a.getZIndex()),
        [stage, layersSwitch],
    );

    const addLayerHandle = () => {
        const layer = new Konva.Layer();
        layer.setAttrs({ creationIndex: getLayerCreationIndex() });
        const transf = new Konva.Transformer();
        layer.add(transf);
        stage?.add(layer);
        toggleLayersSwitch();
    };
    return (
        <div className="flex h-full w-full flex-col overflow-auto ">
            <button type="button" onClick={addLayerHandle}>
                Add Layer
            </button>
            {layers?.map((layer, index) => (
                <LayerButton
                    layer={layer}
                    index={index}
                    key={layer.getAttr('creationIndex')}
                />
            ))}
        </div>
    );
};
