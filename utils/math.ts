
export function lcm(...numbers: number[]): number {
    if (numbers.length < 2) {
        return numbers[0];
    }

    return numbers.reduce(_lcm);
}

/**
 * LCM is defined as abs(a * b) / GCD(a, b)
 *
 * @param  {...any} numbers
 */
function _lcm(a: number, b: number) {
    return Math.abs(a * b) / _gcd(a, b);
}

export function gcd(...numbers: number[]) {
    if (numbers.length < 2) {
        return numbers[0];
    }

    return numbers.reduce(_gcd);
}

/**
 * GCD definition taken from
 * https://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations
 */
function _gcd(a: number, b: number) {
    let t;
    while (b !== 0) {
        t = b;
        b = a % b;
        a = t;
    }

    return a;
}

export function add(a: number, b: number): number;
export function add(a: bigint, b: bigint): bigint;
export function add(a: any, b: any): typeof a {
    return a + b;
}

export function mul(a: number, b: number): number;
export function mul(a: bigint, b: bigint): bigint;
export function mul(a: any, b: any): typeof a {
    return a * b;
}

export function range(a: number, b: number) {
    return Array.from({ length: b - a + 1 }).map((_, i) => i + a);
}
