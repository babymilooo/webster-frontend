import { useProjectStore } from '@/entities/project';
import {
    BoxIcon,
    CursorArrowIcon,
    EraserIcon,
    GroupIcon,
    ImageIcon,
    Pencil1Icon,
} from '@radix-ui/react-icons';
import { useRef } from 'react';

const ProjectLeftSidebar = () => {
    const setState = useProjectStore((state) => state.setState);
    const setImage = useProjectStore((state) => state.setSelectredImage);

    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;

            if (typeof data !== 'string') return;
            setImage(data);
            setState('SelectImage');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed z-10 h-full w-[80px] bg-background pt-[48px]">
            <div className="grid w-full grid-cols-2 border-t-4 border-dashed">
                <div className="flex h-10 w-full items-center justify-center">
                    <CursorArrowIcon
                        className="h-6 w-6 cursor-pointer text-foreground"
                        onClick={() => setState('Drag')}
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
            </div>
        </div>
    );
};

export default ProjectLeftSidebar;
