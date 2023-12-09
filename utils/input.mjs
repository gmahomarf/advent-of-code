import { readFile } from "fs/promises";
/**
 *
 * @return {Promise<string>}
 */
export async function getInput() {
    return _getInput('input.txt');
}

/**
 *
 * @return {Promise<string>}
 */
export async function getExampleInput() {
    return _getInput('input-ex.txt');
}

/**
 *
 * @param {string} file
 * @returns {Promise<string>}
 */
async function _getInput(file) {
    return await readFile(file, 'utf-8');
}

String.prototype.lines = function* () {
    let i = 0;
    let idx;
    while ((idx = this.indexOf('\n', i)) !== -1) {
        yield this.slice(i, idx);
        i = idx + 1;
    }

    if (i < this.length) {
        yield this.slice(i);
    }
}

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

    return this.slice(i, idx < 0 ? undefined : idx)
}

