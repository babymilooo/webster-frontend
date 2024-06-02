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
    SelectBackground,
    setBackgroundLayer,
} from '@/entities/project/ui/SelectBackground';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import { Drag } from '@/entities/project/ui/Drag';
import { setSelectionTopLayer } from '@/entities/project/ui/SelectionArea';
import { TextInstrument } from '@/entities/project/lib/Instruments/Text';
import { ContextMenu } from './project/contextMenu';
import { ScaleBar } from './project/scaleBar';
import { DrawMarker } from '@/entities/project/ui/DrawMarker';
import { DrawInk } from '@/entities/project/ui/DrawInk';
import { DrawSpray } from '@/entities/project/ui/DrawSpray';

export const Project = () => {
    const canvasElementRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const drawingLayerRef = useRef<Konva.Layer | null>(null);

    const setStage = useProjectStore((state) => state.setStage);
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);

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
    const resetProjectStore = useProjectStore((state) => state.resetStore);

    useEffect(() => {
        const applyEventListenersToStage = (stage: Konva.Stage) => {
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
        };
        const initStage = () => {
            if (!canvasElementRef.current) return;
            resetProjectStore();

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
                // console.log(stage);

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
                const applyFiltersToImage = (
                    image: Konva.Image,
                    attrs: any,
                ) => {
                    image.filters([
                        Konva.Filters.Brighten,
                        Konva.Filters.Blur,
                        Konva.Filters.Contrast,
                        Konva.Filters.HSL,
                        Konva.Filters.Pixelate,
                    ]);
                    // console.log(image.pixelSize());

                    if (attrs.brightness !== undefined)
                        image.brightness(attrs.brightness);
                    if (attrs.blurRadius !== undefined)
                        image.blurRadius(attrs.blurRadius);
                    if (attrs.contrast !== undefined)
                        image.contrast(attrs.contrast);
                    if (attrs.hue !== undefined) image.hue(attrs.hue);
                    if (attrs.saturation !== undefined)
                        image.saturation(attrs.saturation);
                    if (attrs.luminance !== undefined)
                        image.luminance(attrs.luminance);
                    if (attrs.pixelSize !== undefined)
                        image.pixelSize(attrs.pixelSize);
                    else image.pixelSize(1);

                    // Применяем фильтры и обновляем слой
                    image.cache();
                    const layer = image.getLayer();
                    if (layer) layer.batchDraw();
                };

                //restore images
                const images = stage.find('Image') as Konva.Image[];
                for (const image of images) {
                    const src = image.getAttr('src');
                    const attrs = image.getAttr('attrs');
                    console.log(attrs);
                    const imageElement = new window.Image();
                    imageElement.src = src;
                    imageElement.crossOrigin = 'anonymous';
                    imageElement.onload = () => {
                        image.image(imageElement);
                        applyFiltersToImage(image, attrs);
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

                applyEventListenersToStage(stage);
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
                    imgElement.src = startImage;
                    imgElement.crossOrigin = 'anonymous';
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
                    imgElement.src = startBackgroundImage;
                    imgElement.crossOrigin = 'anonymous';
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

                applyEventListenersToStage(stage);
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

    return (
        <div className="h-full w-full bg-canva">
            <Drag />
            <AddCircle stageRef={stageRef} />
            <AddRect />
            <StartDrawing
                stageRef={stageRef}
                drawingLayerRef={drawingLayerRef}
            />
            <DrawMarker />
            <DrawInk />
            <DrawSpray />

            <Erasing stageRef={stageRef} drawingLayerRef={drawingLayerRef} />

            <AddImage stageRef={stageRef} />
            <SelectBackground />

            <SelectionArea stageRef={stageRef} />

            <DrawLine stageRef={stageRef} />

            <DrawAnchorLine stageRef={stageRef} />

            <AddText />
            <div className="flex h-full w-full items-center justify-center bg-canva">
                <div className="h-fit w-fit border border-solid border-black">
                    <div id="canvas" ref={canvasElementRef} />
                </div>
            </div>
            <ContextMenu
                contextMenuVisible={contextMenuVisible}
                setContextMenuVisible={setContextMenuVisible}
                contextMenuPosition={contextMenuPosition}
                currentShape={currentShape}
                setCurrentShape={setCurrentShape}
                stageRef={stageRef}
            />
            <ScaleBar stageRef={stageRef} />
        </div>
    );
};
