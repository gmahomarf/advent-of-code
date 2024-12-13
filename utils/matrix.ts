export class Matrix {
    #matrix: number[][];
    constructor(m: number[][]);
    constructor(h: number, w: number);
    constructor(...args: any[]) {
        if (args.length === 1) {
            this.#matrix = Array.from(args[0]);
        } else {
            const [h, w] = args;
            this.#matrix = Array.from({ length: h }).map(_ => new Array(w))
        }

        return new Proxy(this, {
            get(target, key) {
                if (typeof key === 'symbol') {
                    return target[key as any];
                }
                if (Number.isInteger(Number(key))) {
                    return target.source[key as any];
                }

                return target[key as any];
            },
        })
    }

    [n: number]: number[];

    [Symbol.iterator]() {
        return this.source.values();
    };

    get height(): number {
        return this.#matrix.length;
    }

    get width(): number {
        return this.#matrix[0].length;
    }

    get source() {
        return this.#matrix;
    }

    clone() {
        return new Matrix(this.source.slice().map(r => r.slice()));
    }

    solveLinearSystem(): number[] {
        return backwardSubstitution(bareiss(this.clone()));
    }
}


/**
 * 
 * Ignore for now
 */
function argmax<Args extends any[]>(fn: (...args: Args) => number, ...args: Args[]): Args {
    let maxArg = args[0];
    let maxV = fn(...maxArg);
    for (const arg of args.slice(1)) {
        const v = fn(...arg);
        if (v > maxV) {
            maxV = v;
            maxArg = arg;
        }
    }

    return maxArg;
}

/**
 * Adapted from https://en.wikipedia.org/wiki/Bareiss_algorithm#The_algorithm
 */
function bareiss(matrix: Matrix) {
    for (let k = 0; k < matrix.height - 1; k++) {
        for (let i = k + 1; i < matrix.height; i++) {
            for (let j = k + 1; j < matrix.width; j++) {
                matrix[i][j] = (matrix[i][j] * matrix[k][k] - matrix[i][k] * matrix[k][j])
                if (k) {
                    matrix[i][j] /= matrix[k - 1][k - 1]
                }
            }
            matrix[i][k] = 0;
        }
    }

    return matrix;
}

/**
 * Adapted from https://www.baeldung.com/cs/solving-system-linear-equations#gaussian-elimination-with-partial-pivoting
 */
function backwardSubstitution(matrix: Matrix): number[] {
    const solution: number[] = [];
    const rhs = matrix.source.map(r => r[matrix.width - 1]);

    for (let i = matrix.height - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < matrix.height; j++) {
            sum += solution[j] * matrix[i][j];
        }
        solution[i] = (rhs[i] - sum) / matrix[i][i]
    }

    return solution;
}