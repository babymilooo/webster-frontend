import { useProjectStore } from '@/entities/project';
import { Label } from '@/shared/ui/label';
import {
    CircleIcon,
    HomeIcon,
    SlashIcon,
    TextIcon,
} from '@radix-ui/react-icons';
import {
    BoxIcon,
    CursorArrowIcon,
    EraserIcon,
    GroupIcon,
    ImageIcon,
    Pencil1Icon,
} from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { Img } from 'react-image';
export const ProjectNavbar = () => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);
    const setDrawState = useProjectStore((state) => state.setDrawState);
    const selectedFill = useProjectStore((state) => state.selectedFill);
    const selectedStroke = useProjectStore((state) => state.selectedStroke);
    const brushSettings = useProjectStore((state) => state.brushSettings);
    const setBrushSettings = useProjectStore((state) => state.setBrushSettings);
    const setSelectedFill = useProjectStore((state) => state.setSelectedFill);
    const setSelectedStroke = useProjectStore(
        (state) => state.setSelectedStroke,
    );

    const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setSelectedFill(value);
    };

    const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setSelectedStroke(value);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrushSettings({ color: e.target.value });
    };

    const renderIcon = () => {
        switch (state) {
            case 'Drag':
                return (
                    <CursorArrowIcon className="h-6 w-6 cursor-pointer text-foreground" />
                );
            case 'SelectionArea':
                return (
                    <GroupIcon className="h-6 w-6 cursor-pointer text-foreground" />
                );
            case 'CreateFigure':
                return (
                    <>
                        <div className="ml-10 flex gap-2">
                            <BoxIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Rect' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Rect')}
                            />
                            <CircleIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Circle' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Circle')}
                            />
                            <SlashIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Line' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Line')}
                            />
                            <Img
                                src="../src/public/curve.svg"
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'AnchorLine'
                                        ? 'bg-secondary'
                                        : ''
                                }`}
                                onClick={() => setDrawState('AnchorLine')}
                            />
                        </div>
                        <div
                            className={`ml-10 flex ${
                                drawState === 'Line' ||
                                drawState === 'AnchorLine'
                                    ? 'hidden'
                                    : 'flex'
                            }`}
                        >
                            <div className="col-span-1 flex w-full items-center justify-center p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedFill !== ''}
                                    onChange={handleFillChange}
                                />
                                <Label className="pl-1">Fill</Label>
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <input
                                    type="color"
                                    value={selectedFill}
                                    onChange={(e) =>
                                        setSelectedFill(e.target.value)
                                    }
                                    disabled={selectedFill === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                        </div>
                        <div className="ml-5 flex">
                            <div className="col-span-1 flex w-full items-center justify-center p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedStroke !== ''}
                                    onChange={handleStrokeChange}
                                    className={`${
                                        drawState === 'Line' ||
                                        drawState === 'AnchorLine'
                                            ? 'hidden'
                                            : ''
                                    }`}
                                />
                                <Label className="pl-1">Stroke</Label>
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <input
                                    type="color"
                                    value={brushSettings.color}
                                    onChange={handleColorChange}
                                    disabled={brushSettings.color === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Drawing':
                return (
                    <>
                        <Pencil1Icon className="h-6 w-6 cursor-pointer text-foreground" />
                        <div className="ml-5 flex">
                            <div className="col-span-1 flex w-full items-center justify-center p-2">
                                <Label className="pl-1">Stroke</Label>
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <input
                                    type="color"
                                    value={brushSettings.color}
                                    onChange={(e) =>
                                        setBrushSettings({
                                            color: e.target.value,
                                        })
                                    }
                                    disabled={brushSettings.color === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Erasing':
                return (
                    <EraserIcon className="h-6 w-6 cursor-pointer text-foreground" />
                );
            case 'Image':
                return (
                    <ImageIcon className="h-6 w-6 cursor-pointer text-foreground" />
                );
            case 'Text':
                return (
                    <TextIcon className="h-6 w-6 cursor-pointer text-foreground" />
                );

            default:
                return null;
        }
    };
    return (
        <div className="fixed z-20 mt-[5px] h-[43px] w-full bg-background">
            <div className="flex h-full w-full border-t-[5px] border-dashed px-2">
                <div className="flex h-full items-center justify-center">
                    <HomeIcon className="h-6 w-6 cursor-pointer text-foreground" />
                </div>
                <div className="ml-4 flex h-full items-center justify-center">
                    {renderIcon()}
                </div>
            </div>
        </div>
    );
};
