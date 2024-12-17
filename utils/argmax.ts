export function argMax<Args extends any[]>(fn: (...args: Args) => number, args: Iterable<Args>): [maxValue: number, maxArgs: Args] {
    let maxArg: Args = null as unknown as Args;
    let maxV = -Infinity;
    for (const arg of args) {
        const v = fn(...arg);
        if (v > maxV) {
            maxV = v;
            maxArg = arg;
        }
    }

    return [maxV, maxArg];
}

export function argMin<Args extends any[]>(fn: (...args: Args) => number, args: Iterable<Args>): [maxValue: number, maxArgs: Args] {
    let minArg: Args = null as unknown as Args;
    let minV = Infinity;
    for (const arg of args) {
        const v = fn(...arg);
        if (!minArg) {
            minArg = arg;
            minV = v;
        } else if (v < minV) {
            minV = v;
            minArg = arg;
        }
    }

    return [minV, minArg];
}