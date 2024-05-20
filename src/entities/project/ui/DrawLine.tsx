import Konva from 'konva';
import { useProjectStore } from '../model/projectStore';
import { useEffect, useRef, useState } from 'react';
import { clearAllSelection } from '@/entities/project';
import { DrawLineInstrument } from '../lib/Instruments/DrawLine';

type DrawLineProps = {
    stageRef: React.RefObject<Konva.Stage>;
};

const DrawLine: React.FC<DrawLineProps> = ({ stageRef }) => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);

    useEffect(() => {
        if (!stageRef.current) return;
        const stage = stageRef.current;

        if (state === 'CreateFigure' && drawState === 'Line') {
            const instrument = new DrawLineInstrument();
            instrument.applyToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup contextmenu');
                // stage.off('click', handleClick);
                // stage.off('mousemove', handleMouseMove);
                // stage.off('contextmenu', handleContextMenu);
            };
        }
    }, [state, drawState, stageRef]);

    return null;
};

export default DrawLine;
