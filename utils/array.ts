declare global {
    interface Array<T> {
        repeat(n: number): T[];
        getMany(...indices: number[]): T[];
        removeBy(predicate: (o: T) => boolean): void;
        upsert(item: T, eqFn?: (e: T, o: T) => boolean): void;
        sortInt(): this;
    }
}

type Identity = number | string;
type IdentityFn<T> = (o: T) => Identity;

Array.prototype.repeat = function <T>(n: number): T[] {
    const r = [];
    for (let i = 0; i < n; i++) {
        r.push(...this.slice());
    }

    return r;
};

Array.prototype.getMany = function <T, I extends number[]>(this: T[], ...indices: I): (T | undefined)[] {
    return indices.map((i => this.at(i)));
};

Array.prototype.removeBy = function <T>(this: T[], predicate: (o: T) => boolean) {
    const idx = this.findIndex(predicate);
    if (idx !== -1) {
        this.splice(idx, 1);
    }
};

Array.prototype.upsert = function <T>(this: T[], item: T, eqFn: (e: T, o: T) => boolean) {
    const idx = this.findIndex(e => eqFn ? eqFn(e, item) : e === item);
    if (idx !== -1) {
        this.splice(idx, 1, item);
    } else {
        this.push(item);
    }
};

Array.prototype.sortInt = function <T extends number>(this: T[]) {
    return this.sort((a, b) => a - b);
};

export function permutations<T>(options: T[], idFn?: IdentityFn<T>): T[][] {
    const r: T[][] = [];

    _permutations(options, r, new Map<Identity, T>(), idFn!);

    return r;
}

function _permutations<T extends Identity>(opts: T[], results: T[][], seen: Map<T, T>): void;
function _permutations<T, I extends Identity>(opts: T[], results: T[][], seen: Map<I, T>, idFn: IdentityFn<T>): void;
function _permutations<T>(opts: T[], results: T[][], seen: Map<Identity, T>, idFn?: IdentityFn<T>) {
    if (seen.size === opts.length) {
        results.push(Array.from(seen.values()));
    }

    for (const option of opts) {
        const id = idFn ? idFn(option) : option as Identity;
        if (seen.has(id)) continue;
        _permutations(opts, results, seen.set(id, option), idFn!);
        seen.delete(id);
    }
}

