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