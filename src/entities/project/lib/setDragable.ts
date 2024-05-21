import { useProjectStore } from '../model/projectStore';

export const setOffDragable = () => {
    const stage = useProjectStore.getState().stage;
    if (!stage) return;

    stage.find('Circle, Rect, Ellipse, Line').forEach((node) => {
        if (!node.getAttr('handdrawn')) node.draggable(false);
    });
};

export const setOnDragable = () => {
    const layer = useProjectStore.getState().selectedLayer;
    if (!layer) return;

    layer.find('Circle, Rect, Ellipse, Line').forEach((node) => {
        if (!node.getAttr('handdrawn')) node.draggable(true);
    });
};
