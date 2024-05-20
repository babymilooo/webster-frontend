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
            stage.off('click');
            Instrument.applyTextToStage();

            return () => {
                stage.off('click');
            };
        }
    }, [state]);

    return null;
};
