import { useState, useEffect } from 'react';
import { fabric } from 'fabric';

export const Project = () => {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null); // Use fabric.Canvas type or null
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [selection, setSelection] = useState(true);
    useEffect(() => {
        const newCanvas = initCanvas(); // Call initCanvas to get the fabric.Canvas instance
        if (newCanvas) {
            setCanvas(newCanvas); // Set the canvas state after initialization
        }
    }, []);

    const initCanvas = () => {
        const canvas = new fabric.Canvas('canvas', {
            height: 800,
            width: 800,
            backgroundColor: 'white',
            selection: selection,
        });
        return canvas; // Return the fabric.Canvas instance
    };

    const handleAddCircle = () => {
        if (canvas) {
            const circle = new fabric.Circle({
                radius: 50,
                fill: 'red',
                left: 400,
                top: 200,
            });
            canvas.add(circle);
        }
    };

    canvas?.on('object:added', (e) => {
        console.log('Object added:', e.target);
    });

    return (
        <div>
            <button onClick={handleAddCircle}>Add Circle</button>
            <canvas id="canvas" />
        </div>
    );
};
