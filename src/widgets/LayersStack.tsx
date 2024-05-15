import { useProjectStore } from '@/entities/project';
import { FC, useMemo } from 'react';
import { LayerButton } from './LayerButton';

export const LayersStack: FC = () => {
    const stage = useProjectStore((state) => state.stage);
    const layersSwitch = useProjectStore((state) => state.changedLayersSwitch);
    const layers = useMemo(() => stage?.getLayers(), [stage, layersSwitch]);
    return (
        <div className="flex h-full w-40 flex-col overflow-auto">
            {layers?.map((layer, index) => (
                <LayerButton layer={layer} index={index} key={index} />
            ))}
        </div>
    );
};
