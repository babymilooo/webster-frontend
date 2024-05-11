import { useEffect, useRef } from 'react';
import Konva from 'konva';

export const Project = () => {
    const canvasElementRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);

    useEffect(() => {
        const initStage = () => {
            if (!canvasElementRef.current) return;
            const stage = new Konva.Stage({
                container: canvasElementRef.current,
                width: 640,
                height: 480,
            });
            stageRef.current = stage;
        };

        initStage();
        return () => {
            stageRef.current?.destroy();
        };
    }, []);

    const addCircle = () => {
        const stage = stageRef.current;
        if (!stage) return;

        const layer = new Konva.Layer();
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
        stage.add(layer);

        layer.draw();
    };
    return (
        <div>
            <button onClick={addCircle}>Add Circle</button>
            <div className="m-auto border border-solid border-black">
                <div id="canvas" ref={canvasElementRef} />
            </div>
        </div>
    );
};
