declare global {
    interface Array<T> {
        repeat(n: number): T[];
        getMany(...indices: number[]): T[];
    }
}

type Identity = number | string;
type IdentityFn<T> = (o: T) => Identity;
export function permutations<T>(options: T[], idFn?: IdentityFn<T>): T[][];
