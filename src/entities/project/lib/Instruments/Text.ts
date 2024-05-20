import Konva from 'konva';
import { IInstuments } from './types';
import { clearAllSelection, useProjectStore } from '@/entities/project';
import { setOffDragable } from '../setDragable';

export class TextInstrument implements IInstuments {
    type: string = 'Text';
    isDrawing: boolean = false;
    text: Konva.Text | null = null;
    startPose: { x: number; y: number } | null = null;
    applyTextToStage() {
        const stage = useProjectStore.getState().stage;

        if (stage) {
            setOffDragable();
            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', this.onPointerDown);
            stage.on('pointermove', this.onPointerMove);
            stage.on('pointerup', this.onPointerUp);
        }

        useProjectStore.getState();
    }

    onPointerDown() {
        const layer = useProjectStore.getState().selectedLayer;
        const stage = useProjectStore.getState().stage;
        if (!layer || !stage) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

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
            clearAllSelection(stage);
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
        this.text = newText;
        this.isDrawing = true;
        this.startPose = pos;
    }
    onPointerMove() {
        const stage = useProjectStore.getState().stage;
        const layerRef = useProjectStore.getState().selectedLayer;
        if (
            !this.isDrawing ||
            !this.text ||
            !this.startPose ||
            !stage ||
            !layerRef
        )
            return;
        const pos = stage.getPointerPosition();
        if (!pos) return;

        const newX = Math.min(pos.x, this.startPose.x);
        const newY = Math.min(pos.y, this.startPose.y);
        const newWidth = Math.abs(pos.x - this.startPose.x);
        const newHeight = Math.abs(pos.y - this.startPose.y);

        this.text.setAttrs({
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
        });

        layerRef.batchDraw();
    }
    onPointerUp() {
        this.isDrawing = false;
        this.text = null;
    };
}
