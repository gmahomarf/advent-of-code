import { getExampleInput, getInput, Grid, range } from '../../utils/index';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    let total = 0;
    for (const _grid of input.splitByEmptyLines()) {
        const grid = new Grid(..._grid);
        const mirror = getMirror(grid);

        total += mirror.type === 'V' ? mirror.pos : mirror.pos * 100;
        // debug(grid, mirror);
    }

    console.log('Total:', total);
}

main();

/**
 * @typedef Mirror
 * @property {"V" | "H"} type
 * @property {number} pos
 */

/**
 *
 * @param {Grid<string>} grid
 * @returns {Mirror}
 */
function getMirror(grid) {
    for (const mirror of getPossibleMirrors(grid)) {
        if (isMirror(grid, mirror)) {
            return mirror;
        }
    }
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
