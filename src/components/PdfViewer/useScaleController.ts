import { useCallback, useMemo, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

const ZOOM_INC = 0.2;

export const useScaleController = () => {
    const [ scaleState, _setScale ] = useState(1);
    const scaleRef = useRef(scaleState);

    /**
     * We need both state and ref for scale,
     * because in some places we need to be able to get actual scale without being dependent on it (deps array)
     * */
    const setScale = useCallback<typeof _setScale>((fnOrValue) => {
        if (typeof fnOrValue === 'function') {
            _setScale(prevState => {
                const nextValue = fnOrValue(prevState);
                scaleRef.current = nextValue;
                return nextValue;
            })
        } else {
            _setScale(fnOrValue);
            scaleRef.current = fnOrValue;
        }
    }, [])

    const zoomHandler = useCallback((inc: number) => setScale(prev => prev + inc), [ setScale ]);

    const zoomInHandler = useCallback(() => zoomHandler(ZOOM_INC), [ zoomHandler ]);

    const zoomOutHandler = useCallback(() => zoomHandler(-ZOOM_INC), [ zoomHandler ]);

    const debouncedZoomHandler = useMemo(() => debounce(300, setScale), [ setScale ]);

    return {
        scaleState, scaleRef, zoomInHandler, zoomOutHandler, debouncedZoomHandler, setScale
    };
}
