import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Brushes, EraserBrush, PencilBrush } from '@/pages/project/brushes';

export const Project = () => {
    const canvasElementRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);

    const clearAllSelection = (stage?: Konva.Stage | null) => {
        if (!stage) return;
        const transformers = stage.find('Transformer');
        // console.log(transformers);

        transformers.forEach((tr) => {
            // console.log(tr.getType());

            if (tr.getType() === 'Group') (tr as Konva.Transformer).nodes([]);
        });
    };

    useEffect(() => {
        const initStage = () => {
            if (!canvasElementRef.current) return;
            const stage = new Konva.Stage({
                container: canvasElementRef.current,
                width: 640,
                height: 480,
            });
            stageRef.current = stage;

            stage.on('pointerdown', (e) => {
                // console.log(e);
                if (e.target.getType() === 'Stage') {
                    clearAllSelection(stage);
                }
            });
        };

        initStage();
        return () => {
            stageRef.current?.destroy();
        };
    }, []);

    const addCircle = () => {
        const stage = stageRef.current;
        if (!stage) return;

        const layer = new Konva.Layer();
        const transformer = new Konva.Transformer();
        const circle = new Konva.Circle({
            x: stage.width() / 2,
            y: stage.height() / 2,
            radius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
            draggable: true,
        });

        layer.add(circle);
        layer.add(transformer);

        stage.add(layer);
        circle.on('click tap', (e) => {
            clearAllSelection(stageRef.current);
            transformer.nodes([circle]);
        });

        layer.draw();
    };
    const drawingLayerRef = useRef<Konva.Layer | null>(null);
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

    const enableErasing = () => {
        if (!stageRef.current) return;
        let isNew = true;
        let layer = null;
        if (drawingLayerRef.current) {
            layer = drawingLayerRef.current;
            isNew = false;
        } else layer = new Konva.Layer();
        drawingLayerRef.current = layer;
        const brush = new EraserBrush(stageRef.current, layer);
        if (isNew) stageRef.current.add(layer);
        Brushes.applyBrushToStage(stageRef.current, brush);
        layer.draw();
    };

    return (
        <div>
            <button onClick={addCircle}>Add Circle</button>
            <button onClick={enableDrawing}>Start Drawing</button>
            <button onClick={enableErasing}>Start Erasing</button>
            <div className="m-auto border border-solid border-black">
                <div id="canvas" ref={canvasElementRef} />
            </div>
        </div>
    );
};
