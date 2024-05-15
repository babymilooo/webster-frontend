import Konva from 'konva';
import { PencilBrush, useProjectStore } from '@/entities/project';
import { Brushes } from '@/entities/project';
import { useEffect } from 'react';
type StartDrawing = {
    stageRef: React.RefObject<Konva.Stage>;
    drawingLayerRef: React.MutableRefObject<Konva.Layer | null>;
};

export const StartDrawing: React.FC<StartDrawing> = ({
    stageRef,
    drawingLayerRef,
}) => {
    const state = useProjectStore((state) => state.state);

    useEffect(() => {
        if (!stageRef.current) return;
        if (state !== 'Drawing') return;

        let isNew = true;
        let layer = null;
        if (drawingLayerRef.current) {
            layer = drawingLayerRef.current;
            isNew = false;
        } else layer = new Konva.Layer();
        drawingLayerRef.current = layer;
        const brush = new PencilBrush(stageRef.current, layer);
        if (isNew) stageRef.current.add(layer);
        Brushes.applyBrushToStage(stageRef.current, brush);
        layer.draw();
    }, [state, stageRef, drawingLayerRef]);

    return null;
};
