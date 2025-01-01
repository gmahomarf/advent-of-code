import { range } from "itertools";

export function* combinations<T>(iterable: Iterable<T>, r: number): Generator<T[], void, void> {
    // combinations('ABCD', 2) → AB AC AD BC BD CD
    // combinations(range(4), 3) → 012 013 023 123
    const pool = Array.from(iterable);
    const n = pool.length;
    if (r > n) {
        return;
    }

    const indices = Array.from(range(r));

    yield indices.map(i => pool[i]);
    while (true) {
        let i = r - 1;
        for (i of range(r - 1, -1, -1)) {
            if (indices[i] !== i + n - r) {
                break;
            }
            if (i === 0) {
                return;
            }
        }
        indices[i] += 1;
        for (const j of range(i + 1, r)) {
            indices[j] = indices[j - 1] + 1;
        }
        yield indices.map(i => pool[i]);
    }
}

export function* permutations<T>(iterable: Iterable<T>, length?: number): Generator<T[], void, void> {
    // permutations('ABCD', 2) → AB AC AD BA BC BD CA CB CD DA DB DC
    // permutations(range(3)) → 012 021 102 120 201 210
    const pool = Array.from(iterable);
    const n = pool.length;
    const r = length ?? n;
    if (r > n) {
        return;
    }
    const indices = Array.from(range(n));
    const cycles = Array.from(range(n, n - r, -1));
    yield indices.slice(0, r).map(i => pool[i]);

    while (n) {
        let yielded = false;
        for (const i of range(r - 1, -1, -1)) {
            cycles[i] -= 1;
            if (cycles[i] === 0) {
                indices.splice(i, n - i, ...indices.slice(i + 1), ...indices.slice(i, i + 1));
                cycles[i] = n - i;
            } else {
                const j = cycles[i];
                const t = indices[i];
                indices[i] = indices.at(-j)!;
                indices[indices.length - j] = t;
                yield indices.slice(0, r).map(i => pool[i]);
                yielded = true;
                break;
            }
        }

        if (!yielded) {
            return;
        }
    }
}
/*
 *def set_partitions(iterable, k=None, min_size=None, max_size=None):
    """
    Yield the set partitions of *iterable* into *k* parts. Set partitions are
    not order-preserving.

    >>> iterable = 'abc'
    >>> for part in set_partitions(iterable, 2):
    ...     print([''.join(p) for p in part])
    ['a', 'bc']
    ['ab', 'c']
    ['b', 'ac']


    If *k* is not given, every set partition is generated.

    >>> iterable = 'abc'
    >>> for part in set_partitions(iterable):
    ...     print([''.join(p) for p in part])
    ['abc']
    ['a', 'bc']
    ['ab', 'c']
    ['b', 'ac']
    ['a', 'b', 'c']

    if *min_size* and/or *max_size* are given, the minimum and/or maximum size
    per block in partition is set.

    >>> iterable = 'abc'
    >>> for part in set_partitions(iterable, min_size=2):
    ...     print([''.join(p) for p in part])
    ['abc']
    >>> for part in set_partitions(iterable, max_size=2):
    ...     print([''.join(p) for p in part])
    ['a', 'bc']
    ['ab', 'c']
    ['b', 'ac']
    ['a', 'b', 'c']

    """
    L = list(iterable)
    n = len(L)
    if k is not None:
        if k < 1:
            raise ValueError(
                "Can't partition in a negative or zero number of groups"
            )
        elif k > n:
            return

    min_size = min_size if min_size is not None else 0
    max_size = max_size if max_size is not None else n
    if min_size > max_size:
        return

    def set_partitions_helper(L, k):
        n = len(L)
        if k == 1:
            yield [L]
        elif n == k:
            yield [[s] for s in L]
        else:
            e, *M = L
            for p in set_partitions_helper(M, k - 1):
                yield [[e], *p]
            for p in set_partitions_helper(M, k):
                for i in range(len(p)):
                    yield p[:i] + [[e] + p[i]] + p[i + 1 :]

    if k is None:
        for k in range(1, n + 1):
            yield from filter(
                lambda z: all(min_size <= len(bk) <= max_size for bk in z),
                set_partitions_helper(L, k),
            )
    else:
        yield from filter(
            lambda z: all(min_size <= len(bk) <= max_size for bk in z),
            set_partitions_helper(L, k),
        )
 * 
 */
export function* setPartitions<T>(iterable: Iterable<T>, k: number, minSize: number, maxSize: number) {
    const L = Array.from(iterable);
    const n = L.length;

    if (k < 1) {
        throw new Error("Can't partition in a negative or zero number of groups");
    }
    if (k > n) {
        return;
    }
    if (minSize > maxSize) {
        return;
    }

    const setPartitionsHelper = function* (L: T[], k: number): Generator<T[][], void, void> {
        const n = L.length;
        if (k === 1) {
            yield [L];
        } else if (n === k) {
            yield L.map(s => [s]);
        } else {
            const [e, ...M] = L;
            for (const p of setPartitionsHelper(M, k - 1)) {
                yield [[e], ...p];
            }
            for (const p of setPartitionsHelper(M, k)) {
                for (const i of range(p.length)) {
                    yield p.slice(0, i).concat([[e, ...p[i]]], p.slice(i + 1));
                }
            }
        }
    };

    yield* Iterator.from(setPartitionsHelper(L, k)).filter(z => z.every(bk => minSize <= bk.length && bk.length <= maxSize));
}