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
                if (key === Symbol.iterator) {
                    return () => target.#matrix.values();
                }
                if (Number.isInteger(Number(key))) {
                    return target.#matrix[key as any];
                }

                return target[key as any];
            },
        })
    }

    [n: number]: number[];

    [Symbol.iterator]() {
        return this.#matrix.slice().values();
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
}

export function bareiss(m: Matrix) {
    let matrix = m.source;

    for (let k = 0; k < m.height - 1; k++) {
        for (let i = k + 1; i < m.height; i++) {
            for (let j = k + 1; j < m.width; j++) {
                matrix[i][j] = (matrix[i][j] * matrix[k][k] - matrix[i][k] * matrix[k][j])
                if (k) {
                    matrix[i][j] /= matrix[k - 1][k - 1]
                }
            }
            matrix[i][k] = 0;
        }
    }

    return m;
}