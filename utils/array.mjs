/**
 *
 * @template T
 * @this Array<T>
 * @param {number} n
 * @returns {T[]}
 */
Array.prototype.repeat = function (n) {
    const r = [];
    for (let i = 0; i < n; i++) {
        r.push(...this.slice());
    }

    return r;
};

/**
 *
 * @template T
 * @this Array<T>
 * @param {...number} indices
 * @returns {T[]}
 */
Array.prototype.getMany = function (...indices) {
    const mapper = (i => Array.isArray(i) ? i.map(mapper) : this.at(i));
    return indices.map(mapper);
};

/**
 *
 * @template T
 * @this Array<T>
 * @param {(o: T) => boolean} predicate

 */
Array.prototype.removeBy = function (predicate) {
    const idx = this.findIndex(predicate);
    if (idx !== -1) {
        this.splice(idx, 1);
    }
};

/**
 *
 * @template T
 * @this Array<T>
 * @param {T} item
 * @param {(e: T, o: T) => boolean} [eqFn]
 */
Array.prototype.upsert = function (item, eqFn) {
    const idx = this.findIndex(e => eqFn ? eqFn(e, item) : e === item);
    if (idx !== -1) {
        this.splice(idx, 1, item);
    } else {
        this.push(item);
    }
};

Array.prototype.sortInt = function () {
    return this.sort((a, b) => a - b);
};

/**
 * @typedef {number | string} Identity
 */

/**
 * @template T
 * @typedef {(o: T) => Identity} IdentityFn<T>
 */
/**
 *
 * @template T
 * @param {T[]} options
 * @param {IdentityFn<T>} [idFn]
 * @returns {T[][]}
 */
export function permutations(options, idFn) {
    const r = [];

    _permutations(options, r, new Map(), idFn);

    return r;
}
/**
 *
 * @param {T[]} opts
 * @param {T[][]} results
 * @param {Map<Identity, T>} seen
 * @param {IdentityFn<T>} [idFn]
 */
function _permutations(opts, results, seen, idFn) {
    if (seen.size === opts.length) {
        results.push(Array.from(seen.values()));
    }

    for (const option of opts) {
        const id = idFn?.(option) ?? option;
        if (seen.has(id)) continue;
        _permutations(opts, results, seen.set(id, option), idFn);
        seen.delete(id);
    }
}

