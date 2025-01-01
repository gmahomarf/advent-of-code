export function argMax<Args extends any[]>(fn: (...args: Args) => number, args: Iterable<Args>): [maxValue: number, maxArgs: Args] {
    return _helper(fn, args, Math.max);
}

export function argMin<Args extends any[]>(fn: (...args: Args) => number, args: Iterable<Args>): [minValue: number, minArgs: Args] {
    return _helper(fn, args, Math.max);
}

export function argWrap<T>(args: Iterable<T>): Iterable<[T]> {
    return Iterator.from(args).map(e => [e]);
}

function _helper<Args extends any[]>(fn: (...args: Args) => number, args: Iterable<Args>, cmpFn: typeof Math.min | typeof Math.max): [number, Args] {
    const iter = Iterator.from(args);
    const first = iter.next().value!;
    let mArg: Args = null as unknown as Args;
    let mValue = fn(...first);

    for (const arg of iter) {
        const v = fn(...arg);
        mValue = cmpFn(mValue, v);
        mArg = v === mValue ? arg : mArg;
    }

    return [mValue, mArg];
}