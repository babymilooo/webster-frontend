import Konva from 'konva';
import { useProjectStore } from '../../model/projectStore';
import { setOffDragable } from '../setDragable';
import { IInstuments } from './types';
import { KonvaEventObject } from 'konva/lib/Node';
import { clearAllSelection } from '../clearAllSelection';

export class DrawLineInstrument implements IInstuments {
    type = 'DrawLine';
    isDrawing = false;
    points = [];
    line: Konva.Line | null = null;
    tempLine: Konva.Line | null = null;

    applyToStage() {
        const stage = useProjectStore.getState().stage;

        if (stage) {
            setOffDragable();
            stage.off('pointerdown pointermove pointerup contextmenu');
            stage.on('pointerdown', this.onPointerDown);
            stage.on('pointermove', this.onPointerMove);
            stage.on('pointerup', this.onPointerUp);
            stage.on('contextmenu', this.handleContextMenu);
        }
    }

    onPointerDown(e: KonvaEventObject<PointerEvent>) {
        if (!this.points) this.points = [];
        if (e.evt.button !== 0) return;
        const stage = useProjectStore.getState().stage;
        const layer = useProjectStore.getState().selectedLayer;
        if (!stage || !layer) return;
        const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const pos = stage.getPointerPosition();
        if (!pos) return;
        // console.log(this.points);

        const newPoints = [...this.points, pos.x, pos.y];
        // console.log(newPoints);

        if (this.line) {
            this.line.points(newPoints);
            layer.batchDraw();
        } else {
            const newLine = new Konva.Line({
                points: newPoints,
                stroke: 'red',
                strokeWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
                draggable: false,
            });

            // newLine.on('click tap', () => {
            //     clearAllSelection(stage);
            //     transformer.nodes([newLine]);
            // });

            newLine.on('dblclick', () => {
                clearAllSelection(stage);
                transformer.nodes([newLine]);
                transformer.show();
                layer.batchDraw();
            });

            this.line = newLine;
            layer.add(newLine);
        }
        this.points = newPoints;
        this.isDrawing = true;
    }

    onPointerMove(e: KonvaEventObject<PointerEvent>) {
        if (!this.isDrawing) return;
        const stage = useProjectStore.getState().stage;
        const layer = useProjectStore.getState().selectedLayer;
        if (!stage || !layer) return;
        // const transformer = layer.findOne('Transformer') as Konva.Transformer;

        const pos = stage.getPointerPosition();

        if (!pos || this.points.length < 2) return;

        const tempPoints = [...this.points, pos.x, pos.y];
        if (this.tempLine) {
            this.tempLine.points(tempPoints);
        } else {
            const newTempLine = new Konva.Line({
                points: tempPoints,
                stroke: 'red',
                strokeWidth: 2,
                dash: [4, 4], // Optional: makes the temporary line dashed
            });
            layer.add(newTempLine);
            this.tempLine = newTempLine;
        }
        layer.batchDraw();
    }

    onPointerUp(e: KonvaEventObject<PointerEvent>) {
        return;
    }

    handleContextMenu(e: any) {
        if (!this.isDrawing) return;
        e.evt.preventDefault();
        this.isDrawing = false;
        this.line = null;
        this.points = [];
        if (this.tempLine) {
            this.tempLine.destroy(); // Remove the temporary line segment
            this.tempLine = null;
        }
    }
}
