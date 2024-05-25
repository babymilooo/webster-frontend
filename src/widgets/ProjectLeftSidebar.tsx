import { updatePicture, useProjectStore } from '@/entities/project';
import { setOnDragable } from '@/entities/project/lib/setDragable';
import {
    BoxIcon,
    CursorArrowIcon,
    EraserIcon,
    GroupIcon,
    ImageIcon,
    Pencil1Icon,
    TextIcon,
} from '@radix-ui/react-icons';
import { ChangeEvent, useRef } from 'react';

const ProjectLeftSidebar = () => {
    const setState = useProjectStore((state) => state.setState);
    const setImage = useProjectStore((state) => state.setSelectredImage);
    const setBackground = useProjectStore(
        (state) => state.setSelectedBackgroundImage,
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleBackgroundClick = () => {
        backgroundInputRef.current?.click();
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            // const data = e.target?.result;

            // if (typeof data !== 'string') return;
            const src = await updatePicture(file);
            setImage(src);
            setState('SelectImage');
        };
        reader.readAsDataURL(file);
    };

    const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;

            if (typeof data !== 'string') return;
            setBackground(data);
            setState('SelectBackground');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed z-10 h-full w-[80px] bg-background pt-[48px]">
            <div className="grid w-full grid-cols-2 border-t-4 border-dashed">
                <div className="flex h-10 w-full items-center justify-center">
                    <CursorArrowIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={() => {
                            setState('Drag');
                            setOnDragable();
                        }}
                    />
                </div>
                <div className="flex h-10 w-full items-center justify-center">
                    <GroupIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={() => setState('SelectionArea')}
                    />
                </div>
                <div className="flex h-10 w-full items-center justify-center">
                    <BoxIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={() => setState('CreateFigure')}
                    />
                </div>
                <div className="flex h-10 w-full items-center justify-center">
                    <Pencil1Icon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={() => setState('Drawing')}
                    />
                </div>
                <div className="flex h-10 w-full items-center justify-center">
                    <EraserIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={() => setState('Erasing')}
                    />
                </div>

                <div className="flex h-10 w-full items-center justify-center">
                    <ImageIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={handleClick}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={inputRef}
                    />
                </div>
                <div className="flex h-10 w-full items-center justify-center">
                    <TextIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={() => setState('Text')}
                    />
                </div>
                <div className="flex h-10 w-full items-center justify-center">
                    <ImageIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={handleBackgroundClick}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundChange}
                        className="hidden"
                        ref={backgroundInputRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectLeftSidebar;
