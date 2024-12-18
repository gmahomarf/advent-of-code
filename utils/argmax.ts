export function argMax<Args extends any[]>(fn: (...args: Args) => number, args: Iterable<Args>): [maxValue: number, maxArgs: Args] {
    let maxArg: Args = null as unknown as Args;
    let maxV = -Infinity;
    for (const arg of args) {
        const v = fn(...arg);
        maxV = Math.max(maxV, v);
        maxArg = v === maxV ? arg : maxArg;
    }

    return [maxV, maxArg];
}

export function argMin<Args extends any[]>(fn: (...args: Args) => number, args: Iterable<Args>): [maxValue: number, maxArgs: Args] {
    let minArg: Args = null as unknown as Args;
    let minV = Infinity;
    for (const arg of args) {
        const v = fn(...arg);
        minV = Math.min(minV, v);
        minArg = v === minV ? arg : minArg;
    }

    return [minV, minArg];
}

export function argWrap<T>(args: Iterable<T>): Iterable<[T]> {
    return Iterator.from(args).map(e => [e]);
}