import { useProjectStore } from '@/entities/project';
import Konva from 'konva';
import { FC, useEffect, useState } from 'react';

const LayerPreview: FC<{ layer: Konva.Layer }> = ({ layer }) => {
    const [shapes, setShapes] = useState<Konva.Node[] | null>(null);
    const UpdatePreview = useProjectStore((state) => state.UpdatePreview);
    // const [selectedShape, setSelectedShape] = useState<Konva.Node | null>(null);
    const SelectedShape = useProjectStore((state) => state.SelectedShape);
    const setSelectedShape = useProjectStore(
        (state) => state.setSelectredShape,
    );
    const setSelectedLayer = useProjectStore((state) => state.setSelectedLayer);
    const transformer = layer.findOne('Transformer') as Konva.Transformer;
    useEffect(() => {
        // const handleUpdate = () => {
        // };
        const shapes = layer.find('Circle, Rect, Ellipse, Line, Text');
        if (!shapes || !shapes.length) return;
        const selectedShapes = shapes.filter((shape) => {
            if (shape.getAttr('handdrawn') || shape.hasName('_anchor') || shape.hasName('guid-line'))
                return false;
            return true;
        });
        setShapes(selectedShapes); // Pass the first shape in the array
        // layer.on('change', handleUpdate);
        // return () => layer.off('change', handleUpdate);
    }, [layer, UpdatePreview]);

    return (
        <div className="bg-red-100">
            {shapes?.map((shape, index) => (
                <div
                    key={shape.id()}
                    className={`${
                        shape == SelectedShape ? 'bg-muted-foreground' : 'bg-background'
                    }`}
                    onClick={() => {
                        transformer.nodes([shape]);
                        setSelectedShape(shape);
                        setSelectedLayer(layer);
                    }}
                >
                    <img
                        src={shape.toDataURL()}
                        alt="preview"
                        key={shape.id()}
                        className="h-16 w-16 p-2"
                    />
                </div>
            ))}
        </div>
    );
};

export default LayerPreview;
