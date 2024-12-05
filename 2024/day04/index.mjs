import { getExampleInput, getInput, Grid, Point } from '../../utils/index.mjs';

const input = await getInput();

/**
 * 
 * @param {Grid<string>} grid 
 * @param {Point[]} xes 
 */
function countXmasses(grid, xes) {
    const h = grid.length;
    const w = grid[0].length;
    let c = 0;

    for (const point of xes) {
        const { x, y } = point;
        if (x >= 3 && grid[y].slice(x - 3, x + 1) === 'SAMX') { // L ⬅️
            c++;
        }
        if (x < w - 3 && grid[y].slice(x, x + 4) === 'XMAS') { // R ➡️
            c++;
        }
        if (y >= 3 && grid.cols[x].slice(y - 3, y + 1) === 'SAMX') { // U ⬆️
            c++;
        }
        if (y < h - 3 && grid.cols[x].slice(y, y + 4) === 'XMAS') { // D ⬇️
            c++;
        }
        if (x >= 3 && y >= 3 && grid.slice(y - 3, y + 1).reduce((s, row, i) => s + row[x - 3 + i], '') === 'SAMX') { // UL ↖️
            c++;
        }
        if (x < w - 3 && y >= 3 && grid.slice(y - 3, y + 1).reduce((s, row, i) => s + row[x + 3 - i], '') === 'SAMX') { // UR ↗️
            c++;
        }
        if (x >= 3 && y < h - 3 && grid.slice(y, y + 4).reduce((s, row, i) => s + row[x - i], '') === 'XMAS') { // DL ↙️
            c++;
        }
        if (x < w - 3 && y < h - 3 && grid.slice(y, y + 4).reduce((s, row, i) => s + row[x + i], '') === 'XMAS') { // DR ↘️
            c++;
        }
    }

    return c;
}

/**
 * 
 * @param {Grid<string>} grid 
 * @param {Point[]} as 
 */
function countX_Masses(grid, as) {
    const h = grid.length;
    const w = grid[0].length;
    let c = 0;

    for (const point of as) {
        const { x, y } = point;
        if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
            if (grid[y - 1][x - 1] === 'M' && grid[y + 1][x + 1] === 'S') { // DR ↘️
                if (
                    grid[y + 1][x - 1] === 'M' && grid[y - 1][x + 1] === 'S' // UR ↗️
                    || grid[y - 1][x + 1] === 'M' && grid[y + 1][x - 1] === 'S' // DL ↙️
                ) {
                    c++;
                }
            } else if (
                grid[y - 1][x + 1] === 'M' && grid[y + 1][x - 1] === 'S'// DL ↙️
                && grid[y + 1][x + 1] === 'M' && grid[y - 1][x - 1] === 'S' // UL ↖️
            ) {
                c++;
            } else if (
                grid[y + 1][x + 1] === 'M' && grid[y - 1][x - 1] === 'S' // UL ↖️
                && grid[y + 1][x - 1] === 'M' && grid[y - 1][x + 1] === 'S' // UR ↗️
            ) {
                c++;
            }
        }
    }

    return c;
}

async function part1() {
    const xes = [];
    const grid = new Grid();
    let y = 0;
    for await (const line of input.lines()) {
        grid.push(line);
        let x = -1;
        while ((x = line.indexOf('X', x + 1)) !== -1) {
            xes.push(new Point(x, y));
        }
        y++;
    }

    console.log(countXmasses(grid, xes));
}

async function part2() {
    const as = [];
    const grid = new Grid();
    let y = 0;
    for await (const line of input.lines()) {
        grid.push(line);
        let x = -1;
        while ((x = line.indexOf('A', x + 1)) !== -1) {
            as.push(new Point(x, y));
        }
        y++;
    }

    console.log(countX_Masses(grid, as));
}

part1();
part2();