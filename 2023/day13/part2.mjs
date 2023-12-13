import { getExampleInput, getInput } from '../../utils/index.mjs';
import { range } from '../../utils/math.mjs';
import { Grid } from '../../utils/index.mjs';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    let total = 0;
    for (const _grid of input.splitByEmptyLines()) {
        const original = getSmudgedMirror(new Grid(..._grid));

        for (let r = 0; r < _grid.length; r++) {
            const row = _grid[r];
            for (let c = 0; c < row.length; c++) {
                const grid = new Grid(..._grid.slice(0, r)
                    .concat([row.slice(0, c) + (row[c] === '.' ? '#' : '.') + row.slice(c + 1)])
                    .concat(_grid.slice(r + 1)));

                const mirror = getSmudgedMirror(grid, original);
                if (!mirror || mirror.type === original.type && mirror.pos === original.pos) {
                    continue;
                }

                total += mirror.type === 'V' ? mirror.pos : mirror.pos * 100;
                // debug(grid, mirror);
                // debugGrid(grid);
                c = r = Infinity;
            }
        }
    }

    console.log('Total:', total);
}

main();

/**
 *
 * @param {Mirror} m1
 * @param {Mirror} m2
 * @returns {boolean}
 */
function mirrorEq(m1, m2) {
    if (!m1 || !m2) return false;
    return m1.type === m2.type && m1.pos === m2.pos;
}

/**
 * @typedef Mirror
 * @property {"V" | "H"} type
 * @property {number} pos
 */

/**
 *
 * @param {Grid<string>} grid
 * @param {Mirror} [original]
 * @returns {Mirror}
 */
function getSmudgedMirror(grid, original) {
    const mirrors = [];
    for (const mirror of getPossibleMirrors(grid)) {
        if (!mirrorEq(original, mirror) && isMirror(grid, mirror)) {
            mirrors.push(mirror);
        }
    }

    return mirrors.length === 1 ? mirrors[0] : null;
}

/**
 *
 * @param {Grid<string>} grid
 * @returns {Generator<Mirror, void>}
 */
function* getPossibleMirrors(grid) {
    for (const y of range(1, grid.length - 1)) {
        yield { type: 'H', pos: y };
    }
    for (const x of range(1, grid.cols.length - 1)) {
        yield { type: 'V', pos: x };
    }
}

/**
 *
 * @param {Grid<string>} grid
 * @param {Mirror} mirror
 * @returns {boolean}
 */
function isMirror(grid, mirror) {
    if (mirror.type === 'H') {
        const first = grid.slice(0, mirror.pos);
        const second = grid.slice(mirror.pos);

        while (first.length && second.length) {
            if (first.pop() !== second.shift()) {
                return false;
            }
        }
    } else {
        const first = grid.cols.slice(0, mirror.pos);
        const second = grid.cols.slice(mirror.pos);

        while (first.length && second.length) {
            if (first.pop() !== second.shift()) {
                return false;
            }
        }
    }
    return true;
}

/**
 *
 * @param {Grid<string>} grid
 * @param {Mirror} mirror
 */
function debug(grid, mirror) {
    if (mirror.type === 'V') {
        console.log(' '.repeat(mirror.pos) + '\\/');
        grid.forEach(r => console.log(r.slice(0, mirror.pos) + '  ' + r.slice(mirror.pos)));
    } else {
        grid.forEach((r, i) => console.log(r, i === mirror.pos - 1 ? ('\n' + ' '.repeat(r.length) + '<') : ''));
    }

    console.log();
}
