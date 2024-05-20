import { useEffect } from 'react';
import { useProjectStore } from '@/entities/project';
import { TextInstrument } from '../lib/Instruments/Text';

export const AddText = () => {
    const state = useProjectStore((state) => state.state);
    useEffect(() => {
        const stage = useProjectStore.getState().stage;
        if (!stage) return;
        if (state === 'Text') {
            const Instrument = new TextInstrument();
            stage.off('pointerdown pointermove pointerup');
            Instrument.applyTextToStage();

            return () => {
                stage.off('pointerdown pointermove pointerup');
            };
        }
    }, [state]);

    return null;
};
