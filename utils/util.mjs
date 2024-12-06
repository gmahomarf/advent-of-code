/**
 * @class
 * @template {string | number[]} T
 * @extends Array<T>
 */
export class Grid extends Array {
    /**
     * @type {Array<T>}
     */
    #cols;
    get rows() {
        return this.slice();
    }

    get cols() {
        if (!this.#cols) {
            this.#cols = Array.prototype.map.call(this[0], (_, i) => this.reduce((a, b) => a + b[i], ''));
        }

        return this.#cols.slice();
    }

    get height() {
        return this.length;
    }

    get width() {
        return this[0].length;
    }

    getAt(point) {
        return this[point.y]?.[point.x];
    }

    setAt(point, value) {
        const row = this[point.y];
        if (Array.isArray(row)) {
            row[point.x] = value;
        } else {
            this[point.y] = row.slice(0, point.x) + value + row.slice(point.x + 1);
        }
    }

    /**
     * 
     * @returns {Grid<T>}
     */
    clone() {
        return this.slice().map(r => r.slice());
    }
}