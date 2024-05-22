import Konva from 'konva';
import { useProjectStore } from '../model/projectStore';
import { useEffect } from 'react';
import { DrawCurveInstrument } from '../lib/Instruments/DrawAnchorLine';

type DrawLineProps = {
    stageRef: React.RefObject<Konva.Stage>;
};

const DrawAnchorLine: React.FC<DrawLineProps> = ({ stageRef }) => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);

    useEffect(() => {
        if (!stageRef.current) return;
        const stage = stageRef.current;

        if (state === 'CreateFigure' && drawState === 'AnchorLine') {
            const instrument = new DrawCurveInstrument();
            instrument.applyToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup contextmenu');
            };
        }
    }, [state, drawState, stageRef]);

    return null;
};

export default DrawAnchorLine;
