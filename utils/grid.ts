import { Point } from './point';

export class Grid<T extends string | string[] | number[]> extends Array<T> implements Array<T> {
    #cols: T[] | undefined;

    get rows() {
        return this.slice();
    }

    get cols() {
        if (!this.#cols) {
            this.#cols = Array.prototype.map.call(this[0], (_, i) => this.reduce((a, b) => a + b[i], '')) as T[];
        }

        return this.#cols.slice();
    }

    get height() {
        return this.length;
    }

    get width() {
        return this[0].length;
    }

    *gridEntries(): Generator<[Point, T[number]], void, void> {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                yield [new Point(x, y), this[y][x]];
            }
        }
    }

    toString() {
        return this.map(row => Array.isArray(row) ? row.join('') : row).join('\n');
    }

    getAt(point: Point): T[number] {
        return this[point.y]?.[point.x];
    }

    setAt<V extends T[number]>(point: Point, value: V) {
        const row = this[point.y];
        if (Array.isArray(row)) {
            row[point.x] = value;
        } else {
            this[point.y] = row.slice(0, point.x) + value + row.slice(point.x + 1) as T;
        }

        return this;
    }

    clone(): Grid<T> {
        return new Grid(...this.slice().map(r => r.slice() as T));
    }

    hasPoint(p: Point) {
        return p.x >= 0 && p.x < this.width && p.y >= 0 && p.y < this.height;
    }
}