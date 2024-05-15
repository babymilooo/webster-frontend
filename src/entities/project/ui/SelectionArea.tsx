import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/entities/project';

type SelectionAreaProps = {
    stageRef: React.RefObject<Konva.Stage>;
};

export const SelectionArea: React.FC<SelectionAreaProps> = ({ stageRef }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectionRect, setSelectionRect] = useState<Konva.Rect | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
        null,
    );
    const state = useProjectStore((state) => state.state);

    useEffect(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        if (state !== 'SelectionArea') return;

        const layer = new Konva.Layer();
        stage.add(layer);
        layerRef.current = layer;

        const handleMouseDown = () => {
            const pos = stage.getPointerPosition();
            if (!pos) return;

            const newRect = new Konva.Rect({
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                fill: 'rgba(0, 0, 255, 0.3)', // Полупрозрачный синий цвет для выделения
                stroke: 'blue',
                strokeWidth: 2,
                draggable: false,
            });

            layer.add(newRect);
            setSelectionRect(newRect);
            setStartPos(pos);
            setIsDrawing(true);
        };

        const handleMouseMove = () => {
            if (!isDrawing || !selectionRect || !startPos) return;

            const stage = stageRef.current;
            if (!stage) return;

            const pos = stage.getPointerPosition();
            if (!pos) return;

            const newX = Math.min(pos.x, startPos.x);
            const newY = Math.min(pos.y, startPos.y);
            const newWidth = Math.abs(pos.x - startPos.x);
            const newHeight = Math.abs(pos.y - startPos.y);

            selectionRect.setAttrs({
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
            });

            const layer = layerRef.current;
            if (layer) {
                layer.batchDraw();
            }
        };

        const handleMouseUp = () => {
            if (selectionRect) {
                selectionRect.destroy(); // Удаляем прямоугольник после завершения выделения
            }
            setIsDrawing(false);
            setSelectionRect(null);
            setStartPos(null);
            if (layerRef.current) {
                layerRef.current.destroy();
                layerRef.current = null;
            }
            document.removeEventListener('pointerup', handleMouseUp);
            document.removeEventListener('pointerdown', handleMouseDown);
            document.removeEventListener('pointermove', handleMouseMove);
        };

        document.addEventListener('pointerup', handleMouseUp);
        document.addEventListener('pointerdown', handleMouseDown);
        document.addEventListener('pointermove', handleMouseMove);

        return () => {
            document.removeEventListener('pointerup', handleMouseUp);
            document.removeEventListener('pointerdown', handleMouseDown);
            document.removeEventListener('pointermove', handleMouseMove);
        };
    }, [stageRef, isDrawing, selectionRect, startPos, state]);

    return null;
};
