import { useProjectStore } from '@/entities/project';
import { FC, useMemo } from 'react';
import { LayerButton } from './LayerButton';
import Konva from 'konva';
import { getLayerCreationIndex } from '@/entities/project/lib/layerCreationIndex';
import LayerPreview from './LayerPreview';
import { ScrollArea } from '@/shared/ui/scroll-area';

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

    const deleteLayerHandle = () => {
        const selectedLayer = useProjectStore.getState().selectedLayer;
        if (!selectedLayer) return;
        selectedLayer.destroy();
        toggleLayersSwitch();
    };

    return (
        <div className="flex h-full w-full flex-col overflow-auto border-t-4 border-dashed mt-4">
            <div className="grid grid-cols-4">
                <div className='col-span-3 flex items-center pl-2 font-bold text-xl'>layers</div>
                <div className='flex w-full gap-4 text-3xl'>
                    <button type="button" onClick={addLayerHandle}>
                        +
                    </button>
                    <button type="button" onClick={deleteLayerHandle}>
                        -
                    </button>
                </div>
            </div>
            <ScrollArea className="h-full pb-12">
                {layers?.map((layer, index) => (
                    <>
                        <LayerButton
                            layer={layer}
                            index={index}
                            key={layer.getAttr('creationIndex')}
                        />
                        <LayerPreview layer={layer} key={layer.id()} />
                    </>
                ))}
            </ScrollArea>
        </div>
    );
};
