/**
 * @template T
 * @typedef {(o: T) => number | string} IdentityFn<T>
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
        _permutations(opts, results, seen.set(id, option), idFn)
        seen.delete(id);
    }
}
