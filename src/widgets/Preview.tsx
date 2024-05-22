import { useProjectStore } from '@/entities/project';
import Konva from 'konva';
import { useEffect, useState } from 'react';

const Preview = () => {
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    const UpdatePreview = useProjectStore((state) => state.UpdatePreview);
    const [src, setSrc] = useState<any>(null);
    const SelectedShape = useProjectStore((state) => state.SelectedShape);

    useEffect(() => {
        if (!selectedLayer) return;
        const scale = 1 / 2;
        setSrc(selectedLayer.toDataURL({ pixelRatio: scale }));
    }, [selectedLayer, UpdatePreview]);

    const handleEditX = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.x(value);
            }
        }
    };

    const handleEditY = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.y(value);
            }
        }
    };

    const handleEditWidth = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.scaleX(value);
            }
        }
    };

    const handleEditHeight = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.scaleY(value);
            }
        }
    };

    const formatNumber = (num: number) => {
        return num ? num.toFixed(2) : 'N/A';
    };

    return (
        <div className="h-full">
            {SelectedShape ? (
                <>
                    <div className="flex h-[226px] w-full flex-col items-center justify-center border-2 border-dashed border-black">
                        <img
                            src={SelectedShape.toDataURL({})}
                            alt="preview"
                            className="h-16 w-16"
                        />
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="col-span-1 flex w-full">
                            <p>x: </p>
                            <input
                                defaultValue={formatNumber(SelectedShape.x())}
                                onChange={(e) =>
                                    handleEditX(SelectedShape as Konva.Shape, e)
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-1 flex w-full">
                            <p>y:</p>
                            <input
                                defaultValue={formatNumber(SelectedShape.y())}
                                onChange={(e) =>
                                    handleEditY(SelectedShape as Konva.Shape, e)
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-1 flex w-full">
                            <p>scaleX</p>
                            <input
                                defaultValue={formatNumber(
                                    SelectedShape.scaleX(),
                                )}
                                onChange={(e) =>
                                    handleEditWidth(
                                        SelectedShape as Konva.Shape,
                                        e,
                                    )
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-1 flex w-full">
                            <p>scaleY:</p>
                            <input
                                defaultValue={formatNumber(
                                    SelectedShape.scaleY(),
                                )}
                                onChange={(e) =>
                                    handleEditHeight(
                                        SelectedShape as Konva.Shape,
                                        e,
                                    )
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-1 flex w-full">
                            <p>fill:</p>
                            <input
                                defaultValue={(
                                    SelectedShape as Konva.Shape
                                ).fill()} // Cast SelectedShape to Konva.Shape
                                onChange={
                                    (e) =>
                                        (SelectedShape as Konva.Shape).fill(
                                            e.target.value,
                                        ) // Cast SelectedShape to Konva.Shape
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="col-span-1 flex w-full">
                            <p>stroke:</p>
                            <input
                                defaultValue={(
                                    SelectedShape as Konva.Shape
                                ).stroke()} // Cast SelectedShape to Konva.Shape
                                onChange={
                                    (e) =>
                                        (SelectedShape as Konva.Shape).stroke(
                                            e.target.value,
                                        ) // Cast SelectedShape to Konva.Shape
                                }
                                className="w-full"
                            />
                        </div>
                    </div>
                </>
            ) : (
                <img
                    src={src}
                    alt="preview"
                    className="border-2 border-dashed border-black"
                />
            )}
        </div>
    );
};

export default Preview;
