import { useProjectStore } from '@/entities/project';
import Konva from 'konva';
import { FC, useEffect, useState } from 'react';

const LayerPreview: FC<{ layer: Konva.Layer }> = ({ layer }) => {
    const [shapes, setShapes] = useState<Konva.Node[] | null>(null);
    const UpdatePreview = useProjectStore((state) => state.UpdatePreview);
    useEffect(() => {
        // const handleUpdate = () => {
        // };
        const shapes = layer.find('Circle, Rect, Ellipse, Line, Text');
        if (!shapes || !shapes.length) return;
        const selectedShapes = shapes.filter((shape) => {
            if (shape.getAttr('handdrawn') || shape.hasName('_anchor'))
                return false;
            return true;
        });
        setShapes(selectedShapes); // Pass the first shape in the array
        // layer.on('change', handleUpdate);
        // return () => layer.off('change', handleUpdate);
    }, [layer, UpdatePreview]);

    return <div className="bg-red-100">{
        shapes?.map((shape, index) => (
            <img src={shape.toDataURL()} alt="preview" key={index}/>
        ))
    }</div>;
};

export default LayerPreview;
