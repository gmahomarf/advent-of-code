interface String {
    lines(): Generator<string, void, void>;
    entries(): Generator<[number, string], void, void>;
    splitByEmptyLines(): Generator<string[], void, void>;
    numberedLines(): Generator<[number, string], void, void>;
    line(n: number): string;
    count(char: string): number;
    counts(): Map<string, number>;
    allIndicesOf(char: string): Generator<number, void, void>;
    batch(n: number): Generator<string, void, never>;
}

Object.defineProperties(String.prototype, {
    lines: {
        value: function* lines(this: String) {
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
    },
    numberedLines: {
        value: function* numberedLines(this: String) {
            let i = 0;
            const lines = this.lines();
            let line;
            while (!(line = lines.next()).done) {
                yield [i, line.value];
                i++;
            }
        }
    },
    line: {
        value: function (this: String, n: number) {
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
        }
    },
    count: {
        value: function (this: String, char: string) {
            if (char.length !== 1) return 0;
            let count = 0;
            let idx = -1;

            while ((idx = this.indexOf(char, idx + 1)) !== -1) count++;

            return count;
        }
    },
    splitByEmptyLines: {
        value: function* (this: String) {
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
        }
    },
    entries: {
        value: function* (this: String) {
            for (let i = 0; i < this.length; i++) {
                yield [+i, this[i]];
            }
        }
    },
    allIndicesOf: {
        value: function* (this: String, char: string) {
            let i = -1;
            while ((i = this.indexOf(char, i + 1)) !== -1) {
                yield i;
            }
        }
    },
    batch: {
        value: function* (this: String, n: number) {
            let i = 0;
            for (let i = 0; i < this.length; i += n) {
                yield this.slice(i, i + n);
            }
        }
    },
    counts: {
        value: function (this: String) {
            return this[Symbol.iterator]().reduce((m, e) => {
                m.set(e, (m.get(e) ?? 0) + 1);
                return m;
            }, new Map<string, number>());
        }
    },
});
