import { throttle } from 'throttle-debounce';

type TCallback = (delta: number) => void;

export const throttledAccumulator = (delay: number, callback: TCallback) => {
    let accumulatedDelta = 0;

    const throttledCallback = throttle(delay, () => {
        callback(accumulatedDelta);
        accumulatedDelta = 0;
    }, { noLeading: true });

    return (delta: number) => {
        accumulatedDelta += delta;
        throttledCallback();
    }
}
