/**
 *
 * @template T
 * @param {Array<T>} options
 * @param {Array<T[]>} results
 * @param {Set<T>} seen
 */
export function permutations(options, results, seen) {
    if (seen.size === options.length) {
        results.push([...seen])
    }

    for (const option of options) {
        if (seen.has(option)) continue;
        permutations(options, results, seen.add(option))
        seen.delete(option);
    }
}
