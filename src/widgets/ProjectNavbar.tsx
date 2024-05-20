import { useProjectStore } from '@/entities/project';
import { CircleIcon, HomeIcon, SlashIcon, TextIcon } from '@radix-ui/react-icons';
import {
    BoxIcon,
    CursorArrowIcon,
    EraserIcon,
    GroupIcon,
    ImageIcon,
    Pencil1Icon,
} from '@radix-ui/react-icons';
import { useEffect } from 'react';
export const ProjectNavbar = () => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);
    const setDrawState = useProjectStore((state) => state.setDrawState);

    useEffect(() => {
        console.log('state', drawState);
    }, [drawState]);
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
                        <BoxIcon className="h-6 w-6 cursor-pointer text-foreground" />
                        <div className="ml-10 flex gap-2">
                            <BoxIcon
                                className={`h-6 w-6 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Rect'
                                        ? 'bg-muted-foreground'
                                        : ''
                                }`}
                                onClick={() => setDrawState('Rect')}
                            />
                            <CircleIcon
                                className={`h-6 w-6 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Circle'
                                        ? 'bg-muted-foreground'
                                        : ''
                                }`}
                                onClick={() => setDrawState('Circle')}
                            />
                            <SlashIcon
                                className={`h-6 w-6 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Line'
                                        ? 'bg-muted-foreground'
                                        : ''
                                }`}
                                onClick={() => setDrawState('Line')}
                            />
                        </div>
                    </>
                );
            case 'Drawing':
                return (
                    <Pencil1Icon className="h-6 w-6 cursor-pointer text-foreground" />
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
        <div className="fixed z-20 mt-[5px] h-[43px] w-full bg-background pr-[300px]">
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
