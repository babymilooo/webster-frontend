import { useProjectStore } from '@/entities/project';
import { useEffect, useState } from 'react';

const Preview = () => {
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    const UpdatePreview = useProjectStore((state) => state.UpdatePreview);
    const [src, setSrc] = useState<any>(null);
    useEffect(() => {
        if (!selectedLayer) return;
        const scale = 1 / 4;
        setSrc(selectedLayer.toDataURL({ pixelRatio: scale }));
    }, [selectedLayer, UpdatePreview]);

    return (
        <div>
            <img src={src} alt="preview" />
        </div>
    );
};

export default Preview;
