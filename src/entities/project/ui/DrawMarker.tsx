import { Brushes, useProjectStore } from '@/entities/project';
import { useEffect } from 'react';
import { MarkerBrush } from '../lib/Instruments/MarkerBrush';

export const DrawMarker: React.FC = () => {
    const state = useProjectStore((state) => state.state);

    useEffect(() => {
        if (state !== 'DrawingMarker') return;
        const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new MarkerBrush();
        Brushes.applyBrushToStage(stage, brush);
        // layer.draw();
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [state]);

    return null;
};
