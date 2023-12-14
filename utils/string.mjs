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
 * @param {string} char
 * @returns {number}
 */
String.prototype.count = function (char) {
    if (char.length !== 1) return 0;
    let count = 0;
    let idx = -1;

    while ((idx = this.indexOf(char, idx + 1)) !== -1) count++;

    return count;
};

String.prototype.splitByEmptyLines = function* () {
    let lines = [];
    for (const line of this.lines()) {
        const _line = line.trim();
        if (_line) {
            lines.push(_line);
            continue;
        }

        yield lines.slice();
        lines = [];
    }

    if (lines.length) {
        yield lines.slice();
    }
};
