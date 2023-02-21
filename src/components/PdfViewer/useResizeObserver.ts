import { useEffect, useMemo } from 'react';

export const useResizeObserver = (observableElement: Element | null, callback: ResizeObserverCallback) => {
    const resizeObserver = useMemo(() => new ResizeObserver(callback), [ callback ]);

    useEffect(() => {
        if (!observableElement) {
            return;
        }

        resizeObserver.observe(observableElement);
        return () => resizeObserver.disconnect();
    }, [ observableElement, resizeObserver ]);
}
