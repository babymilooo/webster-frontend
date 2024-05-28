import { clearAllSelection, useProjectStore } from '@/entities/project';
import Konva from 'konva';
import { FC, useEffect, useState } from 'react';

const LayerPreview: FC<{ layer: Konva.Layer }> = ({ layer }) => {
    const stage = useProjectStore((state) => state.stage);
    const [shapes, setShapes] = useState<Konva.Node[] | null>(null);
    const UpdatePreview = useProjectStore((state) => state.updatePreview);
    const SelectedShape = useProjectStore((state) => state.selectedShape);
    const setSelectedShape = useProjectStore(
        (state) => state.setSelectredShape,
    );
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const transformer = layer.findOne('Transformer') as Konva.Transformer;
    useEffect(() => {
        const shapes = layer.find('Circle, Rect, Ellipse, Line, Text, Image');
        if (!shapes || !shapes.length) return;
        const selectedShapes = shapes.filter((shape) => {
            if (
                shape.getAttr('handdrawn') ||
                shape.hasName('_anchor') ||
                shape.hasName('guid-line')
            )
                return false;
            return true;
        });
        setShapes(selectedShapes);
    }, [layer, UpdatePreview]);

    return (
        <div className="">
            {shapes?.map((shape, index) => (
                <div
                    key={index}
                    className={`${
                        shape == SelectedShape
                            ? 'bg-secondary'
                            : 'bg-background'
                    }`}
                    onClick={() => {
                        clearAllSelection(stage);
                        transformer.nodes([shape]);
                        setSelectedShape(shape);
                        setSelectedLayer(layer);
                    }}
                >
                    {shape.visible() && (
                        <div className="h-20 w-20 p-2">
                            <img
                                src={shape.toDataURL()}
                                alt="preview"
                                className="h-full w-full object-contain"
                                style={{
                                    aspectRatio: `${
                                        shape.width() / shape.height()
                                    }`,
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default LayerPreview;
