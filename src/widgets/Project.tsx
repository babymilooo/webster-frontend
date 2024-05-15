import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { AddCircle, Erasing, SelectionArea } from '@/entities/project';
import { StartDrawing } from '@/entities/project';
import { AddRect } from '@/entities/project';

export const Project = () => {
    const canvasElementRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const drawingLayerRef = useRef<Konva.Layer | null>(null);

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

            // stage.on('pointerdown', (e) => {
            //     console.log(e.target);
            //     if (e.target === stage) {
            //         clearAllSelection(stage);
            //     }
            // });
            stage.on('mousedown', (e) => {
                if (e.target === stage) {
                    clearAllSelection(stage);
                }
            });
        };

        initStage();
        return () => {
            stageRef.current?.destroy();
        };
    }, []);

    return (
        <div>
            <AddCircle
                stageRef={stageRef}
                clearAllSelection={clearAllSelection}
            />
            <AddRect
                stageRef={stageRef}
                clearAllSelection={clearAllSelection}
            />
            <StartDrawing
                stageRef={stageRef}
                drawingLayerRef={drawingLayerRef}
            />

            <Erasing stageRef={stageRef} drawingLayerRef={drawingLayerRef} />

            <SelectionArea stageRef={stageRef} />
            <div className="m-auto border border-solid border-black">
                <div id="canvas" ref={canvasElementRef} />
            </div>
        </div>
    );
};
