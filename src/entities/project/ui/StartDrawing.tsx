import Konva from 'konva';
import { PencilBrush } from '@/entities/project/index';
import { Brushes } from '@/entities/project/index';
type StartDrawing = {
    stageRef: React.RefObject<Konva.Stage>;
    drawingLayerRef: React.MutableRefObject<Konva.Layer | null>;
};

export const StartDrawing: React.FC<StartDrawing> = ({
    stageRef,
    drawingLayerRef,
}) => {
    const enableDrawing = () => {
        if (!stageRef.current) return;

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
    };

    return <button onClick={enableDrawing}>Start Drawing</button>;
};
