import Konva from 'konva';
import { Brushes, EraserBrush, useProjectStore } from '@/entities/project';
import { useEffect } from 'react';
import { getLayerCreationIndex } from '../lib/layerCreationIndex';

type ErasingProps = {
    stageRef?: React.RefObject<Konva.Stage>;
    drawingLayerRef: React.MutableRefObject<Konva.Layer | null>;
};

export const Erasing: React.FC<ErasingProps> = ({
    stageRef,
    drawingLayerRef,
}) => {
    const state = useProjectStore((state) => state.state);

    useEffect(() => {
        if (state !== 'Erasing') return;
        const stage = useProjectStore.getState().stage;
        if (!stage) return;
        const brush = new EraserBrush();
        Brushes.applyBrushToStage(stage, brush);
        return () => {
            if (!stage) return;
            stage.off('pointerdown pointermove pointerup');
        };
    }, [state, stageRef, drawingLayerRef]);

    return null;
};
