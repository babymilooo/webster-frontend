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
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    // const setState = useProjectStore((state) => state.setState);
    useEffect(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        if (state !== 'SelectionArea') return;

        const layer = new Konva.Layer();
        stage.add(layer);
        layerRef.current = layer;

        const handleMouseDown = () => {
            if (state !== 'SelectionArea') return;
            const pos = stage.getPointerPosition();
            console.log('pos', pos);
            if (!pos) return;

            const newRect = new Konva.Rect({
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                fill: 'rgba(0, 0, 220, 0.3)', // Полупрозрачный синий цвет для выделения
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

            // Находим все фигуры на сцене
            const shapes = stageRef.current?.find(
                'Circle, Rect, Ellipse, Line',
            );
            if (!shapes || !shapes.length) return;

            // Находим трансформер на слое
            const transformer = selectedLayer?.findOne(
                'Transformer',
            ) as Konva.Transformer;
            if (!transformer) return;

            // Проверяем длину массива узлов
            // if (transformer._nodes.length === 0) {
            //     return
            // }

            // Фильтруем выбранные фигуры
            const selectedShapes = shapes.filter((shape) => {
                const shapeBox = shape.getClientRect();
                const selectionBox = selectionRect?.getClientRect();
                if (!selectionBox) return false; // Check if selectionRect is null
                return Konva.Util.haveIntersection(shapeBox, selectionBox);
            });

            // Устанавливаем выбранные узлы для трансформера
            transformer.nodes(selectedShapes);

            console.log('transformer', transformer.getNodes());
            if (selectedShapes.length > 0) {
                return
            }

            // stage.off('pointerup');
            // stage.off('pointerdown');
            // stage.off('pointermove');
            // transformer.on('transformstart', () => {
            //     console.log('transformstart');
            //     setState('transform');
            //     // setState('transform'); // Отключаем режим выделения

            // });

            // transformer.on('transformend', () => {
            //     console.log('transformend');
            //     // Здесь можно добавить логику для включения выделения после завершения трансформации
            //     setState('SelectionArea'); // Включаем режим выделения
            // });

            transformer.off('transformend');
            selectedLayer?.batchDraw(); // Перерисовываем слой
        };

        stage.on('pointerup', handleMouseUp);
        stage.on('pointerdown', handleMouseDown);
        stage.on('pointermove', handleMouseMove);
        return () => {
            stage.off('pointerup');
            stage.off('pointerdown');
            stage.off('pointermove');
        };
    }, [stageRef, isDrawing, selectionRect, startPos, state]);

    return null;
};
