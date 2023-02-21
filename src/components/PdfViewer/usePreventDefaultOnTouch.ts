import { useEffect } from 'react';

/** An attempt to prevent zooming on pinch for mobile devices */
export const usePreventDefaultOnTouch = () => {
    useEffect(() => {
        const handler = function (event: Event) {
            if ('scale' in event && event.scale !== 1) {
                event.preventDefault();
            }
        }

        document.addEventListener('touchmove', handler, { passive: false });

        return () => document.removeEventListener('touchmove', handler);
    })
}
