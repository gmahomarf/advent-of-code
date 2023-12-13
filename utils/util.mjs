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
}
