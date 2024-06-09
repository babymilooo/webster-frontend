import Konva from 'konva';
import { useEffect } from 'react';
import { useProjectStore } from '@/entities/project';
import { CircleInstrument } from '../lib/Instruments/Circle';
// import { getLayerCreationIndex } from '../lib/layerCreationIndex';
type AddCircleProps = {
    stageRef: React.RefObject<Konva.Stage>;
};

export const AddCircle: React.FC<AddCircleProps> = () => {
    const state = useProjectStore((state) => state.state);
    const drawState = useProjectStore((state) => state.drawState);

    useEffect(() => {
        const stage = useProjectStore.getState().stage;
        if (!stage) return;
        if (state === 'CreateFigure' && drawState === 'Circle') {
            const Instrument = new CircleInstrument();
            stage.off('pointerdown pointermove pointerup');
            Instrument.applyCircleToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup');
            };
        }
    }, [state, drawState]);

    return null;
};
