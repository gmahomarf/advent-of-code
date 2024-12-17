interface Array<T> {
    repeat(n: number): T[];
    getMany(...indices: number[]): T[];
    removeBy(predicate: (o: T) => boolean): void;
    upsert(item: T, eqFn?: (e: T, o: T) => boolean): void;
    sortInt(): this;
    equals(other: T[]): boolean;
    allIndicesOf(item: T): Generator<number, void, void>;
    findIndexFrom(i: number, predicate: (value: T, index: number, obj: T[]) => unknown): number;
    findLastIndexFrom(i: number, predicate: (value: T, index: number, obj: T[]) => unknown): number;
    counts<Item extends T & (number | string)>(): Map<Item, number>;
    countsBy<Key extends string | number>(keyFn: (value: T, index: number, obj: T[]) => Key): Map<Key, number>;
    count(predicate: (value: T, index: number, obj: T[]) => boolean): number;
    permutations(idFn?: IdentityFn<T>): T[][];
    batch(n: number): Generator<T[], void, void>;
}

type Identity = number | string;
type IdentityFn<T> = (o: T) => Identity;

Object.defineProperties(Array.prototype, {
    repeat: {
        value: function <T>(this: T[], n: number): T[] {
            const r = [];
            for (let i = 0; i < n; i++) {
                r.push(...this.slice());
            }

            return r;
        }
    },
    getMany: {
        value: function <T, I extends number[]>(this: T[], ...indices: I): (T | undefined)[] {
            return indices.map((i => this.at(i)));
        }
    },
    removeBy: {
        value: function <T>(this: T[], predicate: (o: T) => boolean) {
            const idx = this.findIndex(predicate);
            if (idx !== -1) {
                this.splice(idx, 1);
            }
        }
    },
    upsert: {
        value: function <T>(this: T[], item: T, eqFn: (e: T, o: T) => boolean) {
            const idx = this.findIndex(e => eqFn ? eqFn(e, item) : e === item);
            if (idx !== -1) {
                this.splice(idx, 1, item);
            } else {
                this.push(item);
            }
        }
    },
    sortInt: {
        value: function <T extends number>(this: T[]) {
            return this.sort((a, b) => Number(a) - Number(b));
        }
    },
    equals: {
        value: function <T>(this: T[], other: T[]) {
            if (this.length !== other.length) {
                return false;
            }

            for (let i = 0; i < this.length; i++) {
                if (this[i] !== other[i]) {
                    return false;
                }
            }

            return true;
        }
    },
    allIndicesOf: {
        value: function* <T>(this: T[], item: T) {
            let i = -1;
            while ((i = this.indexOf(item, i + 1)) !== -1) {
                yield i;
            }
        }
    },
    findIndexFrom: {
        value: function <T>(start: number, predicate: (value: T, index: number, obj: T[]) => unknown) {
            for (let i = start; i < this.length; i++) {
                if (predicate(this[i], i, this)) {
                    return i;
                }
            }

            return -1;
        }
    },
    findLastIndexFrom: {
        value: function <T>(this: T[], start: number, predicate: (value: T, index: number, obj: T[]) => unknown) {
            for (let i = start; i >= 0; i--) {
                if (predicate(this[i], i, this)) {
                    return i;
                }
            }

            return -1;
        }
    },
    counts: {
        value: function <T>(this: T[]) {
            return this.reduce((m, e) => {
                m.set(e, (m.get(e) ?? 0) + 1);
                return m;
            }, new Map<T, number>());
        }
    },
    count: {
        value: function <T>(this: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
            return this.reduce((c, e, i, t) => c + +predicate(e, i, t), 0);
        }
    },
    countsBy: {
        value: function <T, Key extends string | number>(this: Array<T>, keyFn: (value: T, index: number, obj: T[]) => Key): Map<Key, number> {
            return this.reduce((m, e, i, a) => {
                const k = keyFn(e, i, a);
                m.set(k, (m.get(k) ?? 0) + 1);
                return m;
            }, new Map<Key, number>());
        }
    },
    permutations: {
        value: function <T>(this: T[], idFn?: IdentityFn<T>): T[][] {
            const r: T[][] = [];
            _permutations(this, r, new Map<Identity, T>(), idFn!);
            return r;
        }
    },
    batch: {
        value: function* <T>(this: T[], n: number) {
            for (let i = 0; i < this.length; i += n) {
                yield this.slice(i, i + n);
            }
        }
    },
});

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

