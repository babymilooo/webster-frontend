import React, { useState } from 'react';
import { MinusIcon, PlusIcon, SymbolIcon } from '@radix-ui/react-icons';

import Konva from 'konva';
import { useProjectStore } from '@/entities/project';

export const ScaleBar: React.FC = () => {
    const [zoomPercentage, setZoomPercentage] = useState(100);
    const stage = useProjectStore((state) => state.stage);
    const handleZoom = (direction: 'in' | 'out') => {
        if (!stage) return;

        const scaleBy = 1.5;
        const oldScale = stage.scaleX();
        const newScale =
            direction === 'in' ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });
        if (direction === 'in') {
            stage.width(stage.width() * scaleBy);
            stage.height(stage.height() * scaleBy);
        } else {
            stage.width(stage.width() / scaleBy);
            stage.height(stage.height() / scaleBy);
        }
        stage.batchDraw();

        const percentage = Math.round(newScale * 100);
        setZoomPercentage(percentage);
    };

    return (
        <div className="fixed bottom-10 z-10 w-full select-none pr-[380px]">
            <div className="flex w-full justify-center">
                <div className="flex items-center gap-8 rounded-lg border bg-background px-8 py-2 shadow-md">
                    <PlusIcon
                        onClick={() => handleZoom('in')}
                        className=" cursor-pointer"
                    />
                    <MinusIcon
                        onClick={() => handleZoom('out')}
                        className=" cursor-pointer"
                    />
                    <span className="w-[100px] text-center text-lg">
                        {zoomPercentage}%
                    </span>
                    <SymbolIcon
                        onClick={() => {
                            stage?.width(stage?.width() / stage?.scaleX());
                            stage?.height(stage?.height() / stage?.scaleY());
                            stage?.scale({ x: 1, y: 1 });
                            stage?.position({ x: 0, y: 0 });
                            setZoomPercentage(100);
                        }}
                        className=" cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};
