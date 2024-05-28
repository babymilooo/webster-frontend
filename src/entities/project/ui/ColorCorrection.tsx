import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from '@/shared/ui/dialog';
import Konva from 'konva';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';

export const ColorCorrection = ({ SelectedShape }: { SelectedShape: any }) => {
    const [blurRadius, setBlurRadius] = useState(0);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [hue, setHue] = useState(0);
    const [luminance, setLuminance] = useState(0);
    const [pixelSize, setPixelSize] = useState(0);
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [tempShape, setTempShape] = useState(null);

    useEffect(() => {
        if (SelectedShape) {
            const copy = SelectedShape.clone();
            setTempShape(copy);
            setImageDataUrl(copy.toDataURL());
        }
    }, [SelectedShape]);

    const cleanFilters = (filters: any[]) => {
        return filters.filter((filter) => filter !== null);
    };

    const updateFilter = (shape: Konva.Shape, filterFunction: any) => {
        let filters = shape.filters() || [];
        filters = cleanFilters(filters); // Remove null values
        if (!filters.includes(filterFunction)) {
            filters = [...filters, filterFunction];
        }
        shape.filters(filters);
    };

    const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBlurRadius = Number(e.target.value);
        setBlurRadius(newBlurRadius);

        if (tempShape) {
            const shape = tempShape as Konva.Shape;
            shape.cache();
            updateFilter(shape, Konva.Filters.Blur);
            shape.blurRadius(newBlurRadius);
            setImageDataUrl(shape.toDataURL());
        }
    };

    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBrightness = Number(e.target.value);
        setBrightness(newBrightness);

        if (tempShape) {
            const shape = tempShape as Konva.Shape;
            shape.cache();
            updateFilter(shape, Konva.Filters.Brighten);
            shape.brightness(newBrightness);
            setImageDataUrl(shape.toDataURL());
        }
    };

    const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newContrast = Number(e.target.value);
        setContrast(newContrast);

        if (tempShape) {
            const shape = tempShape as Konva.Shape;
            shape.cache();
            updateFilter(shape, Konva.Filters.Contrast);
            shape.contrast(newContrast);
            setImageDataUrl(shape.toDataURL());
        }
    };

    const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSaturation = Number(e.target.value);
        setSaturation(newSaturation);

        if (tempShape) {
            const shape = tempShape as Konva.Shape;
            console.log(shape.toDataURL());
            shape.cache();
            updateFilter(shape, Konva.Filters.HSL);
            shape.saturation(newSaturation);
            setImageDataUrl(shape.toDataURL());
        }
    };

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHue = Number(e.target.value);
        setHue(newHue);

        if (tempShape) {
            const shape = tempShape as Konva.Shape;
            shape.cache();
            updateFilter(shape, Konva.Filters.HSL);
            shape.hue(newHue);
            setImageDataUrl(shape.toDataURL());
        }
    };

    const handleLuminanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLuminance = Number(e.target.value);
        setLuminance(newLuminance);

        if (tempShape) {
            const shape = tempShape as Konva.Shape;
            shape.cache();
            updateFilter(shape, Konva.Filters.HSL);
            shape.luminance(newLuminance);
            setImageDataUrl(shape.toDataURL());
        }
    };

    const handlePixelSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPixelSize = Number(e.target.value);
        setPixelSize(newPixelSize);

        if (tempShape) {
            const shape = tempShape as Konva.Shape;
            shape.cache();
            updateFilter(shape, Konva.Filters.Pixelate);
            shape.pixelSize(newPixelSize);
            setImageDataUrl(shape.toDataURL());
        }
    };

    const handleApply = () => {
        if (SelectedShape && tempShape) {
            SelectedShape.cache();
            SelectedShape.filters([
                Konva.Filters.Blur,
                Konva.Filters.Brighten,
                Konva.Filters.Contrast,
                Konva.Filters.HSL,
                Konva.Filters.Pixelate,
            ]);
            SelectedShape.blurRadius(blurRadius);
            SelectedShape.brightness(brightness);
            SelectedShape.contrast(contrast);
            SelectedShape.saturation(saturation);
            SelectedShape.hue(hue);
            SelectedShape.luminance(luminance);
            SelectedShape.pixelSize(pixelSize);
            SelectedShape.getLayer().batchDraw();
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="rounded-lg px-4 py-2 text-center hover:bg-secondary">
                Color Correction
            </DialogTrigger>
            <DialogContent className="w-3/5">
                <DialogTitle>Edit your photo</DialogTitle>
                <div className="grid h-full w-full grid-cols-2">
                    <div className="col-span-1 h-full w-full">
                        <input
                            id="slider"
                            type="range"
                            min="0"
                            max="40"
                            step="0.05"
                            value={blurRadius}
                            onChange={handleBlurChange}
                            className="w-full"
                        />
                        <label htmlFor="slider">Blur</label>
                        <input
                            id="slider"
                            type="range"
                            min="-1"
                            max="1"
                            step="0.05"
                            value={brightness}
                            onChange={handleBrightnessChange}
                            className="w-full"
                        />
                        <label htmlFor="slider">Brightness</label>
                        <input
                            id="slider"
                            type="range"
                            min="-100"
                            max="100"
                            step="1"
                            value={contrast}
                            onChange={handleContrastChange}
                            className="w-full"
                        />
                        <label htmlFor="slider">Contrast</label>
                        <input
                            id="slider"
                            type="range"
                            min="0"
                            max="2"
                            step="0.05"
                            value={saturation}
                            onChange={handleSaturationChange}
                            className="w-full"
                        />
                        <label htmlFor="slider">Saturation</label>
                        <input
                            id="slider"
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={hue}
                            onChange={handleHueChange}
                            className="w-full"
                        />
                        <label htmlFor="slider">Hue</label>
                        <input
                            id="slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={luminance}
                            onChange={handleLuminanceChange}
                            className="w-full"
                        />
                        <label htmlFor="slider">Luminance</label>
                        <input
                            id="slider"
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={pixelSize}
                            onChange={handlePixelSizeChange}
                            className="w-full"
                        />
                        <label htmlFor="slider">Pixel Size</label>
                    </div>

                    <div className="col-span-1 flex h-full w-full items-center justify-center">
                        <img
                            src={imageDataUrl}
                            alt="preview"
                            className=" max-h-[500px]"
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
