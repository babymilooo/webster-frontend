import Konva from 'konva';
import { clearAllSelection, useProjectStore } from '@/entities/project';
import { IInstuments } from './types';
import { setOffDragable } from '../setDragable';

export class CircleInstrument implements IInstuments {
    type: string = 'Circle';
    isDrawing: boolean = false;
    circle: Konva.Circle | null = null;
    setUpdatePreview = useProjectStore.getState().setUpdatePreview;

    applyCircleToStage() {
        const stage = useProjectStore.getState().stage;
        if (stage) {
            setOffDragable();
            stage.off('pointerdown pointermove pointerup');
            stage.on('pointerdown', () => this.onPointerDown());
            stage.on('pointermove', () => this.onPointerMove());
            stage.on('pointerup', () => this.onPointerUp());
            stage.on('pointerup', () => this.setUpdatePreview());
        }
    }
    onPointerDown() {
        const layer = useProjectStore.getState().selectedLayer;
        const stage = useProjectStore.getState().stage;
        if (!stage || !layer) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        const newCircle = new Konva.Circle({
            x: pos.x,
            y: pos.y,
            radius: 0,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
            draggable: false,
            name: 'object',
        });

        newCircle.on('dblclick', () => {
            clearAllSelection(stage);
            transformer.nodes([newCircle]);
            transformer.show();
            layer.batchDraw();
        });

        layer.add(newCircle);
        this.circle = newCircle;
        this.isDrawing = true;
    }
    onPointerMove() {
        if (!this.isDrawing || !this.circle) return;
        const stage = useProjectStore.getState().stage;
        const layer = useProjectStore.getState().selectedLayer;

        if (!stage || !layer) return;

        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        const radius = Math.sqrt(
            Math.pow(pos.x - this.circle.x(), 2) +
                Math.pow(pos.y - this.circle.y(), 2),
        );
        this.circle.radius(radius);
        layer.batchDraw();
    }
    onPointerUp() {
        this.isDrawing = false;
        this.circle = null;
    }
}
