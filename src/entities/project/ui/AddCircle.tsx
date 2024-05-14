import Konva from 'konva';
type AddCircleProps = {
    stageRef: React.RefObject<Konva.Stage>;
    clearAllSelection: (stage?: Konva.Stage | null) => void;
};

export const AddCircle: React.FC<AddCircleProps> = ({
    stageRef,
    clearAllSelection,
}) => {
    const addCircle = () => {
        const stage = stageRef.current;
        if (!stage) return;

        const layer = new Konva.Layer();
        const transformer = new Konva.Transformer();
        const circle = new Konva.Circle({
            x: stage.width() / 2,
            y: stage.height() / 2,
            radius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
            draggable: true,
        });

        layer.add(circle);
        layer.add(transformer);

        stage.add(layer);
        circle.on('click tap', (e) => {
            clearAllSelection(stageRef.current);
            transformer.nodes([circle]);
        });

        layer.draw();
    };

    return <button onClick={addCircle}>Add Circle</button>;
};
