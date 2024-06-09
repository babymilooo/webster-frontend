import { FC, useEffect } from 'react';
import { useProjectStore } from '../model/projectStore';
import { DragInstrument } from '../lib/Instruments/Drag';

export const Drag: FC = () => {
    const state = useProjectStore((state) => state.state);
    useEffect(() => {
        if (state !== 'Drag') return;
        const instrument = new DragInstrument();
        instrument.applyToStage();
    }, [state]);

    return null;
};
