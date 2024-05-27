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
    setLayerCreationIndex,
} from '@/entities/project/lib/layerCreationIndex';
import DrawLine from '@/entities/project/ui/DrawLine';
import { AddText } from '@/entities/project/ui/AddText';
import KonvaSnappingDemo from '@/entities/project/lib/SnapPositions';
import DrawAnchorLine from '@/entities/project/ui/AddAnchorLine';
import {
    setOffDragable,
    setOnDragable,
} from '@/entities/project/lib/setDragable';
import {
    SelectBackground,
    setBackgroundLayer,
} from '@/entities/project/ui/SelectBackground';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import { Drag } from '@/entities/project/ui/Drag';
import { setSelectionTopLayer } from '@/entities/project/ui/SelectionArea';
import { TextInstrument } from '@/entities/project/lib/Instruments/Text';
import { MinusIcon, PlusIcon, SymbolIcon } from '@radix-ui/react-icons';

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

    const [
        startWidth,
        startHeight,
        startJSON,
        startImage,
        startBackgroundImage,
    ] = useInitProjectStore((state) => [
        state.width,
        state.height,
        state.serializedJSON,
        state.startingImage,
        state.startingBackgroundImage,
    ]);

    const instrumentState = useProjectStore((state) => state.state);

    useEffect(() => {
        const initStage = () => {
            if (!canvasElementRef.current) return;
            //adjust canvas size if larger than screen
            const workingSpace = document.getElementById(
                'workingSpace',
            ) as HTMLDivElement;
            let correctedWidth = startWidth;
            let correctedHeight = startHeight;
            if (correctedHeight > workingSpace.clientHeight) {
                const coef = correctedHeight / workingSpace.clientHeight;
                correctedHeight = correctedHeight / coef;
                correctedWidth = correctedWidth / coef;
            }

            if (correctedWidth > workingSpace.clientWidth) {
                const coef = correctedWidth / workingSpace.clientWidth;
                correctedHeight = correctedHeight / coef;
                correctedWidth = correctedWidth / coef;
            }

            resetLayerCreationIndex();
            if (startJSON) {
                const stage = Konva.Stage.create(
                    startJSON,
                    canvasElementRef.current,
                ) as Konva.Stage;

                const lastIndex = stage.getAttr('lastLayerIndex');
                if (lastIndex) setLayerCreationIndex(lastIndex);

                stageRef.current = stage;
                setStage(stage);

                //find and aset backgroundLayer and selectionTopLayer
                const backgroundLayer = stage.findOne('#backgroundLayer') as
                    | Konva.Layer
                    | undefined;
                if (backgroundLayer) setBackgroundLayer(backgroundLayer);

                const selectionTopLayer = stage.findOne(
                    '#selectionTopLayer',
                ) as Konva.Layer | undefined;
                if (selectionTopLayer) setSelectionTopLayer(selectionTopLayer);

                //add snapping lines to layers and select one as selected layer
                const layers = stage.find('Layer') as Konva.Layer[];
                let isSelectedStartLayer = false;
                for (const l of layers) {
                    if (
                        l.id() == 'backgroundLayer' ||
                        l.id() == 'selectionTopLayer'
                    )
                        continue;
                    if (!isSelectedStartLayer) {
                        isSelectedStartLayer = true;
                        setSelectedLayer(l);
                    }
                    new KonvaSnappingDemo(stage, l);
                }

                //restore images
                const images = stage.find('Image') as Konva.Image[];
                for (const image of images) {
                    const src = image.getAttr('src');
                    const imageElement = new window.Image();
                    imageElement.src = src;
                    imageElement.onload = () => {
                        image.image(imageElement);
                        setUpdatePreview();
                    };
                }

                //add event listeners to stuff
                for (const layer of layers) {
                    if (
                        layer.id() == 'backgroundLayer' ||
                        layer.id() == 'selectionTopLayer'
                    )
                        continue;
                    const transformer = layer.findOne('Transformer') as
                        | Konva.Transformer
                        | undefined;
                    if (!transformer) continue;
                    //circles rects and lines
                    const figures = layer.find('.selectable') as Konva.Shape[];
                    for (const fig of figures) {
                        fig.on('dblclick', () => {
                            clearAllSelection(stage);
                            transformer.nodes([fig]);
                            transformer.show();
                            layer.batchDraw();
                        });
                    }
                    //add event listeners to texts
                    const texts = layer.find('.selectableText') as Konva.Text[];
                    for (const text of texts) {
                        text.on('transform', () => {
                            text.setAttrs({
                                width: text.width() * text.scaleX(),
                                height: text.height() * text.scaleY(),
                                scaleX: 1,
                                scaleY: 1,
                            });
                        });

                        text.on('dblclick', () => {
                            TextInstrument.editText(text, layer, transformer);
                            transformer.nodes([text]);
                            transformer.show();
                            layer.batchDraw();
                        });
                    }
                }

                toggleLayersSwitch();
                setUpdatePreview();

                stage.on('mousedown', (e) => {
                    if (e.target === stage) {
                        clearAllSelection(stage);
                    }
                });

                stage.on('mouseup', () => {
                    setUpdatePreview();
                });

                stage.on('dragend transformend', () => {
                    // console.log('dragend transformend');
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
            } else {
                const stage = new Konva.Stage({
                    container: canvasElementRef.current,
                    width: correctedWidth,
                    height: correctedHeight,
                });
                stageRef.current = stage;
                setStage(stage);

                const startLayer = new Konva.Layer();
                const transformer = new Konva.Transformer();
                startLayer.add(transformer);
                startLayer.setAttrs({ creationIndex: getLayerCreationIndex() });
                stage.add(startLayer);

                if (startImage) {
                    const imgElement = new window.Image();
                    // if (!imgElement) return;
                    imgElement.src = startImage;
                    // console.log(selectedBackground);
                    imgElement.onload = () => {
                        const image = new Konva.Image({
                            image: imgElement,
                            draggable: true,
                            width: stage.width(),
                            height: stage.height(),
                            x: 0,
                            y: 0,
                        });
                        startLayer.add(image);
                        toggleLayersSwitch();
                        setUpdatePreview();
                    };
                }
                if (startBackgroundImage) {
                    const backgroundLayer = new Konva.Layer();
                    backgroundLayer.setAttrs({
                        creationIndex: -2,
                        hidden: true,
                        backgroundLayer: true,
                        listening: false,
                        id: 'backgroundLayer',
                    });
                    stage.add(backgroundLayer);
                    backgroundLayer.moveToBottom();
                    setBackgroundLayer(backgroundLayer);

                    const imgElement = new window.Image();
                    // if (!imgElement) return;
                    imgElement.src = startBackgroundImage;
                    // console.log(selectedBackground);
                    imgElement.onload = () => {
                        const image = new Konva.Image({
                            image: imgElement,
                            draggable: false,
                            listening: false,
                            width: stage.width(),
                            height: stage.height(),
                            x: 0,
                            y: 0,
                        });
                        image.setAttrs({ handdrawn: true });
                        backgroundLayer?.add(image);
                        backgroundLayer?.batchDraw();
                        toggleLayersSwitch();
                        setUpdatePreview();
                    };
                }

                setSelectedLayer(startLayer);

                new KonvaSnappingDemo(stage, startLayer);
                toggleLayersSwitch();
                setUpdatePreview();

                stage.on('mousedown', (e) => {
                    if (e.target === stage) {
                        clearAllSelection(stage);
                    }
                });

                stage.on('mouseup', () => {
                    setUpdatePreview();
                });

                stage.on('dragend transformend', () => {
                    // console.log('dragend transformend');
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
            }
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

    useEffect(() => {
        if (instrumentState != 'DrawLine' && instrumentState != 'DrawCurve') {
            const stage = useProjectStore.getState().stage;
            if (!stage) return;
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
        }
    }, [instrumentState]);

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
            if (
                currentShape.hasName('hidden') ||
                currentShape.hasName('_anchor')
            ) {
                setContextMenuVisible(false);
                return;
            }
            currentShape.destroy();
            setCurrentShape(null);
            setContextMenuVisible(false);
            stageRef.current?.batchDraw();
            toggleLayersSwitch();
            setUpdatePreview();
        }
    };

    return (
        <div className="h-full w-full bg-canva">
            <div className="fixed bottom-10 z-10 w-full select-none pr-[380px]">
                <div className="flex w-full justify-center">
                    <div className="flex items-center gap-8 rounded-lg border bg-background px-8 py-2 shadow-md">
                        <PlusIcon
                            onClick={() => handleZoom('in')}
                            className=" cursor-pointer"
                        />
                        <MinusIcon
                            onClick={() => handleZoom('out')}
                            className=" cursor-pointer"
                        />
                        <span className="w-[100px] text-center text-lg">
                            {zoomPercentage}%
                        </span>
                        <SymbolIcon
                            onClick={() => {
                                stageRef.current?.scale({ x: 1, y: 1 });
                                stageRef.current?.position({ x: 0, y: 0 });
                                setZoomPercentage(100);
                            }}
                            className=" cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            <Drag />
            <AddCircle stageRef={stageRef} />
            <AddRect />
            <StartDrawing
                stageRef={stageRef}
                drawingLayerRef={drawingLayerRef}
            />

            <Erasing stageRef={stageRef} drawingLayerRef={drawingLayerRef} />

            <AddImage stageRef={stageRef} />
            <SelectBackground />

            <SelectionArea stageRef={stageRef} />

            <DrawLine stageRef={stageRef} />

            <DrawAnchorLine stageRef={stageRef} />

            <AddText />
            <div className="flex h-full w-full items-center justify-center bg-canva">
                <div
                    style={{
                        width: `${startWidth}px`,
                        height: `${startHeight}px`,
                    }}
                    className="border border-solid border-black"
                >
                    <div id="canvas" ref={canvasElementRef} />
                </div>
            </div>
            {contextMenuVisible && (
                <div
                    className="context-menu"
                    style={{
                        position: 'absolute',
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                        zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing the menu when clicking inside it
                >
                    <div className='bg-background flex flex-col items-start text-sm rounded-lg border shadow-md'>
                        <button onClick={() => handleMoveToLayer()} className='hover:bg-secondary p-1 rounded-t-lg'>
                            Move to next layer
                        </button>
                        <button className='hover:bg-secondary p-1 w-full text-start' onClick={handlePulse}>Pulse</button>
                        <button className='hover:bg-secondary p-1 w-full text-start rounded-b-lg' onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};
