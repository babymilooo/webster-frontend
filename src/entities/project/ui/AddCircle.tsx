import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/entities/project';
import { getLayerCreationIndex } from '../lib/layerCreationIndex';
type AddCircleProps = {
    stageRef: React.RefObject<Konva.Stage>;
    clearAllSelection: (stage?: Konva.Stage | null) => void;
};

export const AddCircle: React.FC<AddCircleProps> = ({
    stageRef,
    clearAllSelection,
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [circle, setCircle] = useState<Konva.Circle | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);
    // const [isAddCircleEnabled, setIsAddCircleEnabled] = useState(false);
    const state = useProjectStore((state) => state.state);
    useEffect(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        if (state === 'CreateCircle') {
            const handleMouseDown = () => {
                const layer = useProjectStore.getState().selectedLayer;
                if (!layer) return;
                const transformer = layer.findOne(
                    'Transformer',
                ) as Konva.Transformer;

                layerRef.current = layer;
                const pos = stage.getPointerPosition();
                if (!pos) return;

                const newCircle = new Konva.Circle({
                    x: pos.x,
                    y: pos.y,
                    radius: 0,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 4,
                    draggable: true,
                });

                newCircle.on('click tap', () => {
                    clearAllSelection(stageRef.current);
                    transformer.nodes([newCircle]);
                });

                layer.add(newCircle);
                setCircle(newCircle);
                setIsDrawing(true);
            };

            const handleMouseMove = () => {
                if (!isDrawing || !circle) return;

                const pos = stage.getPointerPosition();
                if (!pos) return;

                const radius = Math.sqrt(
                    Math.pow(pos.x - circle.x(), 2) +
                        Math.pow(pos.y - circle.y(), 2),
                );
                circle.radius(radius);
                layerRef.current?.batchDraw();
            };

            const handleMouseUp = () => {
                setIsDrawing(false);
                setCircle(null);
            };

            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', handleMouseDown);
            stage.on('pointermove', handleMouseMove);
            stage.on('pointerup', handleMouseUp);

            return () => {
                stage.off('pointerdown pointermove pointerup');
                // stage.off('pointerdown', handleMouseDown);
                // stage.off('pointermove', handleMouseMove);
                // stage.off('pointerup', handleMouseUp);
            };
        }
    }, [stageRef, isDrawing, circle, clearAllSelection, state]);

    return null;
};
