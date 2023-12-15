declare global {
    interface Array<T> {
        repeat(n: number): T[];
        getMany(...indices: number[]): T[];
        removeBy(predicate: (o: T) => boolean): void;
        upsert(item: T, eqFn?: (e: T, o: T) => boolean): void;
    }
}

type Identity = number | string;
type IdentityFn<T> = (o: T) => Identity;
export function permutations<T>(options: T[], idFn?: IdentityFn<T>): T[][];
