import Konva from 'konva';
import { useProjectStore } from '../model/projectStore';
import { useEffect, useRef, useState } from 'react';
import { clearAllSelection } from '@/entities/project';

type DrawLineProps = {
    stageRef: React.RefObject<Konva.Stage>;
};

const DrawLine: React.FC<DrawLineProps> = ({ stageRef }) => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<number[]>([]);
    const [line, setLine] = useState<Konva.Line | null>(null);
    const [tempLine, setTempLine] = useState<Konva.Line | null>(null); // Temporary line segment

    const layerRef = useRef<Konva.Layer | null>(null);

    useEffect(() => {
        if (!stageRef.current) return;
        const stage = stageRef.current;

        if (state === 'CreateFigure' && drawState === 'Line') {
            const layer = useProjectStore.getState().selectedLayer;
            if (!layer) return;
            layerRef.current = layer;

            const transformer = new Konva.Transformer();
            layer.add(transformer);

            const handleClick = (e: any) => {
                if (e.evt.button !== 0) return; // Only proceed if the left mouse button is clicked

                const pos = stage.getPointerPosition();
                if (!pos) return;

                setPoints((prevPoints) => {
                    const newPoints = [...prevPoints, pos.x, pos.y];
                    if (line) {
                        line.points(newPoints);
                        layer.batchDraw();
                    } else {
                        const newLine = new Konva.Line({
                            points: newPoints,
                            stroke: 'red',
                            strokeWidth: 4,
                            lineCap: 'round',
                            lineJoin: 'round',
                            draggable: true,
                        });

                        // newLine.on('click tap', () => {
                        //     clearAllSelection(stageRef.current);
                        //     transformer.nodes([newLine]);
                        // });

                        newLine.on('dblclick', () => {
                            clearAllSelection(stageRef.current);
                            transformer.nodes([newLine]);
                            transformer.show();
                            layer.batchDraw();
                        });

                        setLine(newLine);
                        layer.add(newLine);
                    }
                    return newPoints;
                });
            };

            const handleMouseMove = () => {
                const pos = stage.getPointerPosition();
                if (!pos || points.length < 2) return;

                const tempPoints = [...points, pos.x, pos.y];
                if (tempLine) {
                    tempLine.points(tempPoints);
                } else {
                    const newTempLine = new Konva.Line({
                        points: tempPoints,
                        stroke: 'red',
                        strokeWidth: 2,
                        dash: [4, 4], // Optional: makes the temporary line dashed
                    });
                    layer.add(newTempLine);
                    setTempLine(newTempLine);
                }
                layer.batchDraw();
            };

            const handleContextMenu = (e: any) => {
                e.evt.preventDefault();
                setIsDrawing(false);
                setPoints([]);
                if (tempLine) {
                    tempLine.destroy(); // Remove the temporary line segment
                    setTempLine(null);
                }
            };

            stage.on('click', handleClick);
            stage.on('mousemove', handleMouseMove);
            stage.on('contextmenu', handleContextMenu);

            return () => {
                stage.off('click', handleClick);
                stage.off('mousemove', handleMouseMove);
                stage.off('contextmenu', handleContextMenu);
            };
        }
    }, [state, drawState, stageRef, points, line, tempLine]);

    useEffect(() => {
        if (!isDrawing && line) {
            setLine(null); // Reset the line state when the drawing mode ends
        }
    }, [isDrawing, line]);

    return null;
};

export default DrawLine;
