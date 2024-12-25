export class TupleSet<T extends any[]> implements Set<T> {
    #map;

    constructor(iterable?: Iterable<T> | null) {
        if (iterable) {
            this.#map = new Map<string, T>(Iterator.from(iterable).map(v => [v.toString(), v]));
        } else {
            this.#map = new Map<string, T>();
        }

    }
    [Symbol.iterator](): SetIterator<T> {
        return this.#map.values();
    }

    [Symbol.toStringTag]: string = '[object TupleSet]';

    get size(): number {
        return this.#map.size;
    };

    clear(): void {
        this.#map.clear();
    }
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
        return this.#map.forEach(value => callbackfn(value, value, this));
    }

    entries(): SetIterator<[T, T]> {
        return this.#map.values().map(v => [v, v]);
    }

    keys(): SetIterator<T> {
        return this.#map.values();
    }

    values(): SetIterator<T> {
        return this.#map.values();
    }

    union<U>(other: ReadonlySetLike<U>): Set<T | U> {
        throw new Error("Method not implemented.");
    }

    intersection<U>(other: ReadonlySetLike<U>): Set<T & U> {
        throw new Error("Method not implemented.");
    }

    difference<U>(other: ReadonlySetLike<U>): Set<T> {
        throw new Error("Method not implemented.");
    }

    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U> {
        throw new Error("Method not implemented.");
    }

    isSubsetOf(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }

    isSupersetOf(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }

    isDisjointFrom(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }

    add(value: T) {
        const s = value.toString();
        if (!this.#map.has(s)) {
            this.#map.set(s, value);
        }
        return this;
    }

    has(value: T) {
        return this.#map.has(value.toString());
    }

    delete(value: T): boolean {
        const s = value.toString();
        return this.#map.delete(s);
    }
}

// export class TupleMap<K extends any[], V> extends Map<string, V> {
//     #mapKeys = new Set<string>();
//     add(item: K) {
//         const s = item.toString();
//         if (!this.#setKeys.has(s)) {
//             this.#setKeys.add(s);
//             super.add(item.slice() as K);
//         }
//         return this;
//     }

//     has(item: K) {
//         return this.#setKeys.has(item.toString());
//     }
// }