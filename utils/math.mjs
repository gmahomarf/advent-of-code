
export function lcm(...numbers) {
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
function _lcm(a, b) {
    return Math.abs(a * b) / _gcd(a, b);
}

export function gcd(...numbers) {
    if (numbers.length < 2) {
        return numbers[0];
    }

    return numbers.reduce(_gcd);
}

/**
 * GCD definition taken from
 * https://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations
 */
function _gcd(a, b) {
    let t;
    while (b !== 0) {
        t = b;
        b = a % b;
        a = t;
    }

    return a;
}

/**
 * @template T
 * @param {T} a 
 * @param {T} b 
 * @returns {T}
 */
export function sum(a, b) {
    return a + b;
}