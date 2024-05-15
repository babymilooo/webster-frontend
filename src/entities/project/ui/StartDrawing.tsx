import Konva from 'konva';
import { PencilBrush, useProjectStore } from '@/entities/project';
import { Brushes } from '@/entities/project';
import { useEffect } from 'react';
import { getLayerCreationIndex } from '../lib/layerCreationIndex';
type StartDrawing = {
    stageRef: React.RefObject<Konva.Stage>;
    drawingLayerRef: React.MutableRefObject<Konva.Layer | null>;
};

export const StartDrawing: React.FC<StartDrawing> = ({
    stageRef,
    drawingLayerRef,
}) => {
    const state = useProjectStore((state) => state.state);
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );

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
        if (isNew) {
            layer.setAttrs({ creationIndex: getLayerCreationIndex() });
            stageRef.current.add(layer);
            toggleLayersSwitch();
        }
        Brushes.applyBrushToStage(stageRef.current, brush);
        layer.draw();
    }, [state, stageRef, drawingLayerRef]);

    return null;
};
