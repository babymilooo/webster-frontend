import Konva from 'konva';
import { PencilBrush, useProjectStore } from '@/entities/project';
import { Brushes } from '@/entities/project';
import { useEffect } from 'react';
import { InkBrush } from '../lib/Instruments/InkBrush';

type StartDrawing = {
    stageRef?: React.RefObject<Konva.Stage>;
    drawingLayerRef: React.MutableRefObject<Konva.Layer | null>;
};

export const StartDrawing: React.FC<StartDrawing> = ({
    stageRef,
    drawingLayerRef,
}) => {
    const state = useProjectStore((state) => state.state);

    useEffect(() => {
        if (state !== 'Drawing') return;
        const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new InkBrush();
        Brushes.applyBrushToStage(stage, brush);
        // layer.draw();
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [state, stageRef, drawingLayerRef]);

    return null;
};
