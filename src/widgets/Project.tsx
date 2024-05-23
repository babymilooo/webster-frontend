import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
    getLayerCreationIndex,
    resetLayerCreationIndex,
} from '@/entities/project/lib/layerCreationIndex';
import DrawLine from '@/entities/project/ui/DrawLine';
import { AddText } from '@/entities/project/ui/AddText';
import KonvaSnappingDemo from '@/entities/project/lib/SnapPositions';
import DrawAnchorLine from '@/entities/project/ui/AddAnchorLine';
import {
    setOffDragable,
    setOnDragable,
} from '@/entities/project/lib/setDragable';

export const Project = () => {
    const canvasElementRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const drawingLayerRef = useRef<Konva.Layer | null>(null);
    const setStage = useProjectStore((state) => state.setStage);
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);
    const [zoomPercentage, setZoomPercentage] = useState(100);
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0,
    });
    const [currentShape, setCurrentShape] = useState<Konva.Shape | null>(null);

    useEffect(() => {
        const initStage = () => {
            if (!canvasElementRef.current) return;
            resetLayerCreationIndex();
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

            stage.on('mouseup', () => {
                setUpdatePreview();
            });

            stage.on('dragend transformend', () => {
                console.log('dragend transformend');
                setUpdatePreview();
            });

            stage.on('contextmenu', (e) => {
                e.evt.preventDefault();
                if (e.target === stage) {
                    setContextMenuVisible(false);
                    return;
                }
                if (e.target instanceof Konva.Shape) {
                    const shape = e.target;
                    setCurrentShape(shape);
                    
                    setContextMenuPosition({
                        x: e.evt.clientX,
                        y: e.evt.clientY,
                    });
                    setContextMenuVisible(true);
                }
            });
        };

        const handleClickOutside = (e: MouseEvent) => {
            const contextMenuElement = document.querySelector('.context-menu');
            if (
                contextMenuElement &&
                !contextMenuElement.contains(e.target as Node)
            ) {
                setContextMenuVisible(false);
                setCurrentShape(null);
            }
        };

        initStage();
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            stageRef.current?.destroy();
            document.removeEventListener('mousedown', handleClickOutside);
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

    const handleMoveToLayer = () => {
        const selectedLayer = useProjectStore.getState().selectedLayer;
        const stage = useProjectStore.getState().stage;
        if (!selectedLayer || !stageRef.current) return;

        const selectedLayerZindex = selectedLayer.getZIndex();
        const layers = stage
            ?.getLayers()
            .toSorted((a, b) => b.getZIndex() - a.getZIndex())
            .filter(
                (layer) => layer !== selectedLayer && !layer.getAttr('hidden'),
            );
        let targetLayer = layers?.find(
            (layer) => layer.getZIndex() > selectedLayerZindex,
        );

        if (!targetLayer) {
            targetLayer = new Konva.Layer();
            targetLayer.setAttrs({ creationIndex: getLayerCreationIndex() });
            const transf = new Konva.Transformer();
            targetLayer.add(transf);
            stageRef.current.add(targetLayer);
            toggleLayersSwitch();
        }

        const transformer = selectedLayer.findOne(
            'Transformer',
        ) as Konva.Transformer;
        const selectedShapes = transformer.nodes();

        if (selectedShapes.length === 0) {
            currentShape?.moveTo(targetLayer);
        } else {
            selectedShapes.forEach((shape) => {
                shape.moveTo(targetLayer);
            });
        }
        if (stage) {
            new KonvaSnappingDemo(stage, targetLayer);
        }

        transformer.detach();
        selectedLayer.batchDraw();
        targetLayer.batchDraw();
        setContextMenuVisible(false);
        setUpdatePreview();
        setOffDragable();
        setOnDragable();
    };

    const handlePulse = () => {
        if (currentShape) {
            currentShape.to({
                scaleX: 2,
                scaleY: 2,
                onFinish: () => {
                    currentShape.to({ scaleX: 1, scaleY: 1 });
                },
            });
            setContextMenuVisible(false);
        }
    };

    const handleDelete = () => {
        if (currentShape) {
            currentShape.destroy();
            setCurrentShape(null);
            setContextMenuVisible(false);
            stageRef.current?.batchDraw();
        }
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

            <DrawAnchorLine stageRef={stageRef} />

            <AddText />
            <div className="m-auto border border-solid border-black">
                <div id="canvas" ref={canvasElementRef} />
            </div>
            {contextMenuVisible && (
                <div
                    className="context-menu"
                    style={{
                        position: 'absolute',
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                        backgroundColor: 'white',
                        boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                        zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing the menu when clicking inside it
                >
                    <div>
                        <button onClick={() => handleMoveToLayer()}>
                            Move to Drawing Layer
                        </button>
                        <button onClick={handlePulse}>Pulse</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};
