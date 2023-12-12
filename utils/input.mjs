import { readFile } from "fs/promises";

export async function getInput() {
    return _getInput('input.txt');
}

export async function getExampleInput(n = '') {
    return _getInput(`input-ex${n}.txt`);
}

async function _getInput(file) {
    return readFile(file, 'utf-8');
}

String.prototype.lines = function* lines() {
    let i = 0;
    let idx;
    while ((idx = this.indexOf('\n', i)) !== -1) {
        yield this.slice(i, idx);
        i = idx + 1;
    }

    if (i < this.length) {
        yield this.slice(i);
    }
};

/**
 *
 * @param {number} n
 * @returns {string}
 */
String.prototype.line = function (n) {
    let i = 0;
    let idx;
    let line = 0;

    if (n < 0) {
        return '';
    }

    while ((idx = this.indexOf('\n', i)) !== -1 && line < n) {
        i = idx + 1;
        line++;
    }

    if (n > line) {
        return '';
    }

    return this.slice(i, idx < 0 ? undefined : idx);
};

/**
 *
 * @template T
 * @param {number} n
 * @returns {T[]}
 */
Array.prototype.repeat = function (n) {
    const r = [];
    for (let i = 0; i < n; i++) {
        r.push(...this.slice());
    }

    return r;
};
