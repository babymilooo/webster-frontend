import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/entities/project';

type AddRectProps = {
    stageRef: React.RefObject<Konva.Stage>;
    clearAllSelection: (stage?: Konva.Stage | null) => void;
};

export const AddRect: React.FC<AddRectProps> = ({
    stageRef,
    clearAllSelection,
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [rect, setRect] = useState<Konva.Rect | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
        null,
    );
    const state = useProjectStore((state) => state.state);
    useEffect(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        if (state === 'CreateRect') {
            const layer = new Konva.Layer();
            const transformer = new Konva.Transformer();
            layer.add(transformer);
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
                    fill: 'none',
                    stroke: 'black',
                    strokeWidth: 4,
                    draggable: true,
                });

                newRect.on('click tap', () => {
                    clearAllSelection(stageRef.current);
                    transformer.nodes([newRect]);
                });

                layer.add(newRect);
                setRect(newRect);
                setStartPos(pos);
                setIsDrawing(true);
            };

            const handleMouseMove = () => {
                if (!isDrawing || !rect || !startPos) return;

                const pos = stage.getPointerPosition();
                if (!pos) return;

                const newX = Math.min(pos.x, startPos.x);
                const newY = Math.min(pos.y, startPos.y);
                const newWidth = Math.abs(pos.x - startPos.x);
                const newHeight = Math.abs(pos.y - startPos.y);

                rect.setAttrs({
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight,
                });

                layer.batchDraw();
            };

            const handleMouseUp = () => {
                setIsDrawing(false);
                setRect(null);
                setStartPos(null);
            };

            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', handleMouseDown);
            stage.on('pointermove', handleMouseMove);
            stage.on('pointerup', handleMouseUp);

            return () => {
                stage.off('pointerdown', handleMouseDown);
                stage.off('pointermove', handleMouseMove);
                stage.off('pointerup', handleMouseUp);
            };
        }
    }, [stageRef, isDrawing, rect, clearAllSelection, state]);

    return null
};
