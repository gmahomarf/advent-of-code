export class TupleSet<K extends any[]> implements Set<K> {
    #map = new Map<string, K>();

    [Symbol.iterator](): SetIterator<K> {
        return this.#map.values();
    }

    [Symbol.toStringTag]: string = '[object TupleSet]';

    get size(): number {
        return this.#map.size;
    };

    clear(): void {
        this.#map.clear();
    }
    forEach(callbackfn: (value: K, value2: K, set: Set<K>) => void, thisArg?: any): void {
        return this.#map.forEach(value => callbackfn(value, value, this));
    }

    entries(): SetIterator<[K, K]> {
        return this.#map.values().map(v => [v, v]);
    }

    keys(): SetIterator<K> {
        return this.#map.values();
    }

    values(): SetIterator<K> {
        return this.#map.values();
    }

    union<U>(other: ReadonlySetLike<U>): Set<K | U> {
        throw new Error("Method not implemented.");
    }

    intersection<U>(other: ReadonlySetLike<U>): Set<K & U> {
        throw new Error("Method not implemented.");
    }

    difference<U>(other: ReadonlySetLike<U>): Set<K> {
        throw new Error("Method not implemented.");
    }

    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<K | U> {
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

    add(value: K) {
        const s = value.toString();
        if (!this.#map.has(s)) {
            this.#map.set(s, value);
        }
        return this;
    }

    has(value: K) {
        return this.#map.has(value.toString());
    }

    delete(value: K): boolean {
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