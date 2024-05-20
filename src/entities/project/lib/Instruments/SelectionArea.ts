import { useProjectStore } from "../../model/projectStore";
import { IInstuments } from "./types";

export class SelectionAreaInstrument implements IInstuments{

    applyCircleToStage() {
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
}