import { useProjectStore } from '@/entities/project';
import KonvaSnappingDemo from '@/entities/project/lib/SnapPositions';
import { getLayerCreationIndex } from '@/entities/project/lib/layerCreationIndex';
import { useUserStore } from '@/entities/user';
import Konva from 'konva';
import {
    setOffDragable,
    setOnDragable,
} from '@/entities/project/lib/setDragable';
import { useState } from 'react';
import { deleteBg } from '@/entities/project/api/deleteBg';

interface ContextMenuProps {
    contextMenuVisible: boolean;
    setContextMenuVisible: (visible: boolean) => void;
    contextMenuPosition: { x: number; y: number };
    currentShape: Konva.Shape | null;
    setCurrentShape: (shape: Konva.Shape | null) => void;
    stageRef: React.RefObject<Konva.Stage>;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    contextMenuVisible,
    setContextMenuVisible,
    contextMenuPosition,
    currentShape,
    setCurrentShape,
    stageRef,
}) => {
    const isLogin = useUserStore((state) => state.isLogin);
    const [loading, setLoading] = useState(false);
    const toggleLayersSwitch = useProjectStore(
        (state) => state.toggleLayersSwitch,
    );
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);

    const handleMoveToLayer = () => {
        const selectedLayer = useProjectStore.getState().selectedLayer;
        const stage = useProjectStore.getState().stage;
        if (!selectedLayer || !stageRef.current) return;

        const selectedLayerZindex = selectedLayer.getZIndex();
        const layers = stage
            ?.getLayers()
            .toSorted((a, b) => b.getZIndex() - a.getZIndex())
            .filter(
                (layer) => layer !== selectedLayer && !layer.getAttr('hidden'),
            );
        let targetLayer = layers?.find(
            (layer) => layer.getZIndex() > selectedLayerZindex,
        );

        if (!targetLayer) {
            targetLayer = new Konva.Layer();
            targetLayer.setAttrs({ creationIndex: getLayerCreationIndex() });
            const transf = new Konva.Transformer();
            targetLayer.add(transf);
            stageRef.current.add(targetLayer);
            toggleLayersSwitch();
        }

        const transformer = selectedLayer.findOne(
            'Transformer',
        ) as Konva.Transformer;
        const selectedShapes = transformer.nodes();

        if (selectedShapes.length === 0) {
            currentShape?.moveTo(targetLayer);
        } else {
            selectedShapes.forEach((shape) => {
                shape.moveTo(targetLayer);
            });
        }
        if (stage) {
            new KonvaSnappingDemo(stage, targetLayer);
        }

        transformer.detach();
        selectedLayer.batchDraw();
        targetLayer.batchDraw();
        setContextMenuVisible(false);
        setUpdatePreview();
        setOffDragable();
        setOnDragable();
    };

    const handlePulse = () => {
        if (currentShape) {
            currentShape.to({
                scaleX: 2,
                scaleY: 2,
                onFinish: () => {
                    currentShape.to({ scaleX: 1, scaleY: 1 });
                },
            });
            setContextMenuVisible(false);
        }
    };

    const handleDelete = () => {
        if (currentShape) {
            if (
                currentShape.hasName('hidden') ||
                currentShape.hasName('_anchor')
            ) {
                setContextMenuVisible(false);
                return;
            }
            currentShape.destroy();
            setCurrentShape(null);
            setContextMenuVisible(false);
            stageRef.current?.batchDraw();
            toggleLayersSwitch();
            setUpdatePreview();
        }
    };

    const handleDeleteBackground = async () => {
        setLoading(true);
        const response = await deleteBg(currentShape?.getAttr('src'));
        if (response) {
            currentShape?.setAttr('src', response.image);
            setUpdatePreview();
        }
        setLoading(false);
    };
    return (
        <div>
            {contextMenuVisible && (
                <div
                    className="context-menu"
                    style={{
                        position: 'absolute',
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                        zIndex: 20,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing the menu when clicking inside it
                >
                    <div className="flex flex-col items-start rounded-lg border bg-background text-sm shadow-md">
                        <button
                            onClick={() => handleMoveToLayer()}
                            className="rounded-t-lg p-1 hover:bg-secondary"
                        >
                            Move to next layer
                        </button>
                        {loading ? (
                            <div className="w-full p-1 text-start">
                                Loading...
                            </div>
                        ) : (
                            currentShape?.getAttr('src') &&
                            isLogin && (
                                <button
                                    onClick={() => handleDeleteBackground()}
                                    className="rounded-t-lg p-1 hover:bg-secondary"
                                >
                                    delete background
                                </button>
                            )
                        )}
                        <button
                            className="w-full p-1 text-start hover:bg-secondary"
                            onClick={handlePulse}
                        >
                            Pulse
                        </button>
                        <button
                            className="w-full rounded-b-lg p-1 text-start hover:bg-secondary"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
