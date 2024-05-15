import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useProjectStore } from '../model/projectStore';

export interface IBaseBrush {
    type: string;
    onPointerDown: (e: Konva.KonvaEventObject<PointerEvent>) => void;
    onPointerMove: (e: Konva.KonvaEventObject<PointerEvent>) => void;
    onPointerUp: (e: Konva.KonvaEventObject<PointerEvent>) => void;
}

export class Brushes {
    static applyBrushToStage(stage: Konva.Stage, brush: IBaseBrush) {
        stage.off('pointerdown pointermove pointerup');
        stage.on('pointerdown', brush.onPointerDown);
        stage.on('pointermove', brush.onPointerMove);
        stage.on('pointerup', brush.onPointerUp);
        useProjectStore
            .getState()
            .setBrushSettings({ selectedBrush: brush.type });
    }

    // static applyBrushToLayer(layer: Konva.Layer, brush: IBaseBrush) {
    //     // console.log(brush);

    //     layer.off('pointerdown pointermove pointerup');
    //     layer.on('pointerdown', brush.onPointerDown);
    //     layer.on('pointermove', brush.onPointerMove);
    //     layer.on('pointerup', brush.onPointerUp);
    // }
}

export class PencilBrush implements IBaseBrush {
    type = 'Pencil';
    isPaint = false;
    lastLine: Konva.Line | null = null;
    onPointerDown: (e: KonvaEventObject<PointerEvent>) => void = (e) => {
        // console.log(e);
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        if (!stage || !target) return;

        this.isPaint = true;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        this.lastLine = new Konva.Line({
            stroke: brushSettings.color,
            strokeWidth: brushSettings.width * e.evt.pressure,
            globalCompositeOperation: 'source-over',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
        });
        target.add(this.lastLine);
    };
    onPointerMove: (e: KonvaEventObject<PointerEvent>) => void = (e) => {
        // console.log(e);
        if (!this.isPaint) {
            return;
        }
        e.evt.preventDefault();
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        if (!stage || !target) return;

        const pos = stage.getPointerPosition();
        if (!pos || !this.lastLine) return;
        // set end of old line to current point
        const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
        this.lastLine.points(newPoints);

        // create new line with current position and pressure
        this.lastLine = new Konva.Line({
            stroke: brushSettings.color,
            strokeWidth: brushSettings.width * e.evt.pressure,
            globalCompositeOperation: 'source-over',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
        });
        target.add(this.lastLine);
    };
    onPointerUp: (e: KonvaEventObject<PointerEvent>) => void = (e) => {
        // console.log(e);
        this.isPaint = false;
    };
}

export class EraserBrush implements IBaseBrush {
    type = 'Eraser';
    isPaint = false;
    lastLine: Konva.Line | null = null;
    onPointerDown: (e: KonvaEventObject<PointerEvent>) => void = (e) => {
        // console.log(e);
        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        if (!stage || !target) return;

        this.isPaint = true;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        this.lastLine = new Konva.Line({
            stroke: brushSettings.color,
            strokeWidth: brushSettings.width,
            globalCompositeOperation: 'destination-out',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
        });
        target.add(this.lastLine);
    };
    onPointerMove: (e: KonvaEventObject<PointerEvent>) => void = (e) => {
        // console.log(e);
        if (!this.isPaint) {
            return;
        }
        e.evt.preventDefault();

        const stage = useProjectStore.getState().stage;
        const target = useProjectStore.getState().selectedLayer;
        const brushSettings = useProjectStore.getState().brushSettings;
        if (!stage || !target) return;

        const pos = stage.getPointerPosition();
        if (!pos || !this.lastLine) return;
        // set end of old line to current point
        const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
        this.lastLine.points(newPoints);

        // create new line with current position and pressure
        this.lastLine = new Konva.Line({
            stroke: brushSettings.color,
            strokeWidth: brushSettings.width,
            globalCompositeOperation: 'destination-out',
            // round cap for smoother lines
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [pos.x, pos.y, pos.x, pos.y],
        });
        target.add(this.lastLine);
    };
    onPointerUp: (e: KonvaEventObject<PointerEvent>) => void = (e) => {
        // console.log(e);
        this.isPaint = false;
    };
}