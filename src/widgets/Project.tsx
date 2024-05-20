import { useEffect, useRef, useState } from 'react';
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
import { AddText } from '@/entities/project/ui/AddText';
import KonvaSnappingDemo from '@/entities/project/lib/SnapPositions';

export const Project = () => {
    const canvasElementRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const drawingLayerRef = useRef<Konva.Layer | null>(null);
    const setStage = useProjectStore((state) => state.setStage);
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const [zoomPercentage, setZoomPercentage] = useState(100);
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

            new KonvaSnappingDemo(stage, startLayer);

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

    const handleZoom = (direction: 'in' | 'out') => {
        const stage = stageRef.current;
        if (!stage) return;

        const scaleBy = 1.5;
        const oldScale = stage.scaleX();
        const newScale =
            direction === 'in' ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });
        stage.batchDraw();

        const percentage = Math.round(newScale * 100);
        setZoomPercentage(percentage);
    };

    return (
        <div>
            <div>
                <button onClick={() => handleZoom('in')}>Zoom In</button>
                <span>Zoom: {zoomPercentage}%</span>
                <button onClick={() => handleZoom('out')}>Zoom Out</button>
            </div>
            <AddCircle stageRef={stageRef} />
            <AddRect />
            <StartDrawing
                stageRef={stageRef}
                drawingLayerRef={drawingLayerRef}
            />

            <Erasing stageRef={stageRef} drawingLayerRef={drawingLayerRef} />

            <AddImage stageRef={stageRef} />

            <SelectionArea stageRef={stageRef} />

            <DrawLine stageRef={stageRef} />

            <AddText />
            <div className="m-auto border border-solid border-black">
                <div id="canvas" ref={canvasElementRef} />
            </div>
        </div>
    );
};
