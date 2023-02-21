export function roundToPrecision(num: number, precision: number): number {
    const factor = 10 ** precision;
    return Math.round(num * factor) / factor;
}
