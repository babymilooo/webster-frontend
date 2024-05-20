import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { clearAllSelection, useProjectStore } from '@/entities/project';

type AddTextProps = {
    stageRef: React.RefObject<Konva.Stage>;
};

export const AddText: React.FC<AddTextProps> = ({ stageRef }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [text, setText] = useState<Konva.Text | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);
    const state = useProjectStore((state) => state.state);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
        null,
    );

    useEffect(() => {
        console.log('AddText useEffect');
    }, []);

    useEffect(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        if (state === 'Text') {
            const handleMouseDown = () => {
                console.log('handleMouseDown');
                const layer = useProjectStore.getState().selectedLayer;
                if (!layer) return;
                const transformer = layer.findOne(
                    'Transformer',
                ) as Konva.Transformer;

                layerRef.current = layer;
                const pos = stage.getPointerPosition();
                if (!pos) return;

                const newText = new Konva.Text({
                    x: pos.x,
                    y: pos.y,
                    width: 0,
                    height: 0,
                    fill: 'black',
                    text: 'Editable text',
                    fontSize: 20,
                    strokeWidth: 4,
                    draggable: true,
                });

                newText.on('dblclick', () => {
                    clearAllSelection(stageRef.current);
                    transformer.nodes([newText]);
                    transformer.show();
                    layer.batchDraw();

                    // Show text input for editing
                    const textArea = document.createElement('textarea');
                    textArea.value = newText.text();
                    textArea.style.position = 'absolute';
                    textArea.style.left = newText.x() + 'px';
                    textArea.style.top = newText.y() + 'px';
                    textArea.style.width = newText.width() + 'px';
                    textArea.style.height = newText.height() + 'px';
                    textArea.style.zIndex = '10';
                    document.body.appendChild(textArea);

                    textArea.focus();
                    textArea.addEventListener('blur', () => {
                        newText.text(textArea.value);
                        document.body.removeChild(textArea);
                        layer.batchDraw();
                    });
                });

                // transformer.add(newText);

                layer.add(newText);
                setText(newText);
                setStartPos(pos);
                setIsDrawing(true);
            };

            const handleMouseMove = () => {
                if (!isDrawing || !text || !startPos) return;

                const pos = stage.getPointerPosition();
                if (!pos) return;

                const newX = Math.min(pos.x, startPos.x);
                const newY = Math.min(pos.y, startPos.y);
                const newWidth = Math.abs(pos.x - startPos.x);
                const newHeight = Math.abs(pos.y - startPos.y);

                text.setAttrs({
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight,
                });

                layerRef.current?.batchDraw();
            };

            const handleMouseUp = () => {
                setIsDrawing(false);
                setText(null);
                setStartPos(null);
            };

            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', handleMouseDown);
            stage.on('pointermove', handleMouseMove);
            stage.on('pointerup', handleMouseUp);

            return () => {
                stage.off('pointerdown pointermove pointerup');
                // stage.off('pointerdown', handleMouseDown);
                // stage.off('pointermove', handleMouseMove);
                // stage.off('pointerup', handleMouseUp);
            };
        }
    }, [stageRef, isDrawing, text, clearAllSelection, state]);

    return null;
};
