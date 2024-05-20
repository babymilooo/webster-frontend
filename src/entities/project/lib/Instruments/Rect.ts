import Konva from 'konva';
import { IInstuments } from './types';
import { useProjectStore } from '../../model/projectStore';
import { setOffDragable } from '../setDragable';
import { clearAllSelection } from '../clearAllSelection';

export class RectInstrument implements IInstuments {
    type = 'Rect';
    isDrawing = false;
    rect: Konva.Rect | null = null;
    startPos: { x: number; y: number } | null = null;

    applyToStage() {
        const stage = useProjectStore.getState().stage;

        if (stage) {
            setOffDragable();
            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', this.onPointerDown);
            stage.on('pointermove', this.onPointerMove);
            stage.on('pointerup', this.onPointerUp);
        }
    }

    onPointerDown() {
        const layer = useProjectStore.getState().selectedLayer;
        const stage = useProjectStore.getState().stage;
        if (!layer || !stage) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const newRect = new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: 'none',
            stroke: 'black',
            strokeWidth: 4,
            draggable: false,
            name: 'object',
        });

        newRect.on('click tap', () => {
            clearAllSelection(stage);
            transformer.nodes([newRect]);
        });

        layer.add(newRect);
        this.rect = newRect;
        this.startPos = pos;
        this.isDrawing = true;
    }
    onPointerMove() {
        const layer = useProjectStore.getState().selectedLayer;
        const stage = useProjectStore.getState().stage;
        if (!layer || !stage) return;
        if (!this.isDrawing || !this.rect || !this.startPos) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const newX = Math.min(pos.x, this.startPos.x);
        const newY = Math.min(pos.y, this.startPos.y);
        const newWidth = Math.abs(pos.x - this.startPos.x);
        const newHeight = Math.abs(pos.y - this.startPos.y);

        this.rect.setAttrs({
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
        });

        layer.batchDraw();
    }
    onPointerUp() {
        this.isDrawing = false;
        this.rect = null;
        this.startPos = null;
    }
}
