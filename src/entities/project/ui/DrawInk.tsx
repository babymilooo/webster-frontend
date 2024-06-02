import { Brushes, useProjectStore } from '@/entities/project';
import { useEffect } from 'react';
import { InkBrush } from '../lib/Instruments/InkBrush';

export const DrawInk: React.FC = () => {
    const state = useProjectStore((state) => state.state);

    useEffect(() => {
        if (state !== 'DrawingInk') return;
        const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new InkBrush();
        Brushes.applyBrushToStage(stage, brush);
        // layer.draw();
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [state]);

    return null;
};
