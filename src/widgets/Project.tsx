import { useEffect, useRef } from 'react';
import Konva from 'konva';
import {
    AddCircle,
    AddImage,
    Erasing,
    SelectionArea,
    clearAllSelection,
    useProjectStore,
} from '@/entities/project';
import { StartDrawing } from '@/entities/project';
import { AddRect } from '@/entities/project';
import { getLayerCreationIndex } from '@/entities/project/lib/layerCreationIndex';
import DrawLine from '@/entities/project/ui/DrawLine';

export const Project = () => {
    const canvasElementRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const drawingLayerRef = useRef<Konva.Layer | null>(null);
    const setStage = useProjectStore((state) => state.setStage);
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);

    useEffect(() => {
        const initStage = () => {
            if (!canvasElementRef.current) return;
            const stage = new Konva.Stage({
                container: canvasElementRef.current,
                width: 640,
                height: 480,
            });
            stageRef.current = stage;

            const startLayer = new Konva.Layer();
            const transformer = new Konva.Transformer();
            startLayer.add(transformer);
            startLayer.setAttrs({ creationIndex: getLayerCreationIndex() });
            stage.add(startLayer);
            setStage(stage);
            setSelectedLayer(startLayer);

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
            <AddCircle stageRef={stageRef} />
            <AddRect
                stageRef={stageRef}
                clearAllSelection={clearAllSelection}
            />
            <StartDrawing
                stageRef={stageRef}
                drawingLayerRef={drawingLayerRef}
            />

            <Erasing stageRef={stageRef} drawingLayerRef={drawingLayerRef} />

            <AddImage stageRef={stageRef} />

            <SelectionArea stageRef={stageRef} />

            <DrawLine stageRef={stageRef} />
            <div className="m-auto border border-solid border-black">
                <div id="canvas" ref={canvasElementRef} />
            </div>
        </div>
    );
};
