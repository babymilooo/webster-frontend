import { FC, useEffect, useRef } from 'react';
import './fabricBrushes';
import { fabric } from 'fabric';
import { ICanvasOptions } from 'fabric/fabric-impl';

export const Playground: FC = () => {
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const initFabric = () => {
            fabricRef.current = new fabric.Canvas(canvasRef.current, {
                enablePointerEvents: true,
                enableRetinaScaling: true,
                isDrawingMode: true,
            } as ICanvasOptions);
            fabricRef.current.freeDrawingBrush = new (fabric as any).InkBrush(
                fabricRef.current,
                {
                    width: 1,
                    color: '#000',
                    opacity: 1,
                },
            );
            console.log(fabricRef.current.freeDrawingBrush);

            fabricRef.current.on('mouse:down', (event) => {
                console.log(event);
            });
        };

        const addRectangle = () => {
            const rect = new fabric.Rect({
                top: 50,
                left: 50,
                width: 50,
                height: 50,
                fill: 'red',
            });

            fabricRef?.current?.add(rect);
        };

        const disposeFabric = () => {
            fabricRef?.current?.dispose();
        };

        initFabric();
        addRectangle();

        return () => {
            disposeFabric();
        };
    }, []);

    return (
        <>
            <div>
                <div className="m-auto p-4">
                    <button
                        onClick={() => {
                            if (!fabricRef.current) return;
                            fabricRef.current.freeDrawingBrush = new (
                                fabric as any
                            ).EraserBrush(fabricRef.current);
                            fabricRef.current.freeDrawingBrush.width = 10;
                        }}
                    >
                        Eraser
                    </button>
                    <canvas
                        className="h-[480px] w-[640px] border border-solid border-black"
                        height={480}
                        width={640}
                        ref={canvasRef}
                    ></canvas>
                </div>
            </div>
        </>
    );
};
