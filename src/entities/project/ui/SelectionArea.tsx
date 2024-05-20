import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/entities/project';

type SelectionAreaProps = {
    stageRef?: React.RefObject<Konva.Stage>;
};

let selectionTopLayer: Konva.Layer | null = null;

export const SelectionArea: React.FC<SelectionAreaProps> = () => {
    const isDrawingRef = useRef(false);
    const selectionRectRef = useRef<Konva.Rect | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
        null,
    );
    const state = useProjectStore((state) => state.state);
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    // const setState = useProjectStore((state) => state.setState);
    const stage = useProjectStore((state) => state.stage);
    const layerSwitch = useProjectStore((state) => state.changedLayersSwitch);
    const ignoreHandlesRef = useRef<boolean>(false);
    useEffect(() => {
        if (!stage) return;
        if (selectionTopLayer) selectionTopLayer.moveToTop();

        if (state !== 'SelectionArea') return;

        if (!selectionTopLayer) {
            selectionTopLayer = new Konva.Layer();
            selectionTopLayer.setAttrs({ creationIndex: -1, hidden: true });
            stage.add(selectionTopLayer);
            selectionTopLayer.moveToTop();
        }

        const handleMouseDown = () => {
            if (ignoreHandlesRef.current) return;
            if (selectionRectRef.current) {
                selectionRectRef.current.destroy();
                selectionRectRef.current = null;
            }
            const layer = selectionTopLayer;
            if (!layer) return;
            layerRef.current = layer;
            if (state !== 'SelectionArea') return;
            const pos = stage.getPointerPosition();
            // console.log('pos', pos);
            if (!pos) return;
            // console.log('pointerdown');

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
            selectionRectRef.current = newRect;
            setStartPos(pos);
            isDrawingRef.current = true;
        };

        const handleMouseMove = () => {
            // console.log('top move');

            if (ignoreHandlesRef.current && isDrawingRef.current) {
                console.log('stuff');

                isDrawingRef.current = false;
                setStartPos(null);
                if (selectionRectRef.current) {
                    selectionRectRef.current.destroy();
                    selectionRectRef.current = null;
                }
            }
            if (ignoreHandlesRef.current) return;
            if (state !== 'SelectionArea') return;
            if (!isDrawingRef.current || !selectionRectRef.current || !startPos)
                return;

            if (!stage) return;

            const pos = stage.getPointerPosition();
            if (!pos) return;
            // console.log('pointermove');

            const newX = Math.min(pos.x, startPos.x);
            const newY = Math.min(pos.y, startPos.y);
            const newWidth = Math.abs(pos.x - startPos.x);
            const newHeight = Math.abs(pos.y - startPos.y);

            selectionRectRef.current.setAttrs({
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
            });

            const layer = selectionTopLayer;
            if (layer) {
                layer.batchDraw();
            }
        };

        const handleMouseUp = () => {
            if (ignoreHandlesRef.current) return;
            if (state !== 'SelectionArea') return;
            if (!stage || !selectedLayer) return;
            isDrawingRef.current = false;

            setStartPos(null);

            // Находим все фигуры на сцене
            const shapes = selectedLayer.find('Circle, Rect, Ellipse, Line, Text');
            if (!shapes || !shapes.length) return;
            // console.log(shapes);

            // Находим трансформер на слое
            const transformer = selectedLayer?.findOne(
                'Transformer',
            ) as Konva.Transformer;
            if (!transformer) return;
            // console.log('pointerup');

            // Проверяем длину массива узлов
            // if (transformer._nodes.length === 0) {
            //     return
            // }

            // Фильтруем выбранные фигуры
            const selectedShapes = shapes.filter((shape) => {
                const shapeBox = shape.getClientRect();
                const selectionBox = selectionRectRef.current?.getClientRect();

                if (!selectionBox) return false; // Check if selectionRect is null
                if (shape == selectionRectRef.current) return false;
                return Konva.Util.haveIntersection(shapeBox, selectionBox);
            });

            // Устанавливаем выбранные узлы для трансформера
            transformer.nodes(selectedShapes);

            // console.log('transformer', transformer.getNodes());
            if (selectionRectRef.current) {
                selectionRectRef.current.destroy(); // Удаляем прямоугольник после завершения выделения
            }
            selectionRectRef.current = null;

            transformer.on('transformstart', (ev) => {
                // console.log('transform start');
                ignoreHandlesRef.current = true;
                isDrawingRef.current = false;
                setStartPos(null);
                if (selectionRectRef.current) {
                    selectionRectRef.current.destroy();
                    selectionRectRef.current = null;
                }
            });
            transformer.on('transformend', (ev) => {
                // console.log('transform end');
                ignoreHandlesRef.current = false;
            });
            // if (selectedShapes.length > 0) {
            //     return;
            // }

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

            // transformer.off('transformend');
            selectedLayer?.batchDraw(); // Перерисовываем слой
        };
        stage.off('pointerup pointerdown pointermove');
        stage.on('pointerup', handleMouseUp);
        stage.on('pointerdown', handleMouseDown);
        stage.on('pointermove', handleMouseMove);
        return () => {
            stage.off('pointerup pointerdown pointermove');
        };
    }, [stage, startPos, state, selectedLayer, layerSwitch]);

    return null;
};
