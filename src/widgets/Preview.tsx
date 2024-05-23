import { useProjectStore } from '@/entities/project';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import Konva from 'konva';
import { useEffect, useState } from 'react';

const Preview = () => {
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    const UpdatePreview = useProjectStore((state) => state.updatePreview);
    const [src, setSrc] = useState<any>(null);
    const SelectedShape = useProjectStore((state) => state.selectedShape);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);

    const [fill, setFill] = useState<string>(
        (SelectedShape as Konva.Shape)?.fill() || '',
    );
    const [stroke, setStroke] = useState<string>(
        (SelectedShape as Konva.Shape)?.stroke() || '',
    );

    useEffect(() => {
        setFill((SelectedShape as Konva.Shape)?.fill() || '');
        setStroke((SelectedShape as Konva.Shape)?.stroke() || '');
    }, [SelectedShape]);

    const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setFill(value);
        (SelectedShape as Konva.Shape).fill(value);
    };

    const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setStroke(value);
        (SelectedShape as Konva.Shape).stroke(value);
        setUpdatePreview();
    };

    const handleFillColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFill(e.target.value);
        (SelectedShape as Konva.Shape).fill(e.target.value);
        setUpdatePreview();
    };

    const handleStrokeColorChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setStroke(e.target.value);
        (SelectedShape as Konva.Shape).stroke(e.target.value);
    };

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
                    <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">x</p>
                            <input
                                key={`x-${SelectedShape?.x()}`}
                                defaultValue={formatNumber(SelectedShape.x())}
                                onChange={(e) =>
                                    handleEditX(SelectedShape as Konva.Shape, e)
                                }
                                className="w-12"
                            />
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">
                                scaleX
                            </p>
                            <input
                                key={`scaleX-${SelectedShape?.scaleX()}`}
                                defaultValue={formatNumber(
                                    SelectedShape.scaleX(),
                                )}
                                onChange={(e) =>
                                    handleEditWidth(
                                        SelectedShape as Konva.Shape,
                                        e,
                                    )
                                }
                                className="w-12"
                            />
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">y</p>
                            <input
                                key={`y-${SelectedShape?.y()}`}
                                defaultValue={formatNumber(SelectedShape.y())}
                                onChange={(e) =>
                                    handleEditY(SelectedShape as Konva.Shape, e)
                                }
                                className="w-12"
                            />
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">
                                scaleY
                            </p>
                            <input
                                key={`scaleY-${SelectedShape?.scaleY()}`}
                                defaultValue={formatNumber(
                                    SelectedShape.scaleY(),
                                )}
                                onChange={(e) =>
                                    handleEditHeight(
                                        SelectedShape as Konva.Shape,
                                        e,
                                    )
                                }
                                className="w-12"
                            />
                        </div>
                        <div className="col-span-1 flex w-full items-center justify-center p-2">
                            <input
                                type="checkbox"
                                checked={fill !== ''}
                                onChange={handleFillChange}
                            />
                            <Label className="pl-1">Fill</Label>
                        </div>
                        <div className="col-span-1 flex w-full items-center justify-center p-2">
                            <input
                                type="checkbox"
                                checked={stroke !== ''}
                                onChange={handleStrokeChange}
                            />
                            <Label className="pl-1">Stroke</Label>
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <input
                                type="color"
                                value={fill !== '' ? fill : '#000000'}
                                onChange={handleFillColorChange}
                                disabled={fill === ''}
                                className="w-16"
                            />
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <input
                                type="color"
                                value={stroke !== '' ? stroke : '#000000'}
                                onChange={handleStrokeColorChange}
                                disabled={stroke === ''}
                                className="w-16"
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
