import { getExampleInput, getInput, Grid, Point } from '../../utils/index.mjs';

import { WorkerPool } from '../../utils/worker-pool.mjs';

const input = await getInput();

async function parse() {
    const grid = new Grid();
    let start;
    for await (const [y, line] of input.numberedLines()) {
        grid.push(line);
        const x = line.indexOf('^');
        if (x !== -1) {
            start = new Point(x, y);
            grid[y] = line.replace('^', '.');
        }
    }

    return {
        grid,
        start,
    };
}

const directionOrder = ['D', 'R', 'U', 'L'];

/**
 * 
 * @param {Grid} grid 
 * @param {Point} start 
 * @returns {Set<string>}
 */
function getAllVisited(grid, start) {
    const pos = start.clone();
    const visited = new Set();
    for (let i = 0; ; i = ++i % 4) {
        const direction = directionOrder[i];
        while (1) {
            visited.add(pos.toString());
            if (grid.getAt(pos.clone()[direction]()) !== '.') {
                break;
            }
            pos[direction]();
        }

        if (pos.y === 0 || pos.y === grid.height - 1 || pos.x === 0 || pos.x === grid.width - 1) {
            break;
        }
    }
    return visited;
}

/**
 * 
 * @param {Grid} grid 
 * @param {Point} start 
 */
function part1(grid, start) {
    const pos = start.clone();
    const visited = getAllVisited(grid, pos);

    console.log(visited.size);
}

/**
 * 
 * @param {Grid} grid 
 * @param {Point} start 
 */
async function part2(grid, start) {
    const pool = new WorkerPool('./find-obstacle.mjs');
    const pos = start.clone();
    const visited = getAllVisited(grid, pos);
    const obstacles = [];



    for (const coords of visited) {
        const p = Point.from(coords);
        if (p.equals(start)) {
            continue;
        }
        const clone = grid.clone();
        pool.runTask({
            grid: clone,
            start,
            point: p,
        }, (_err, obstacle) => {
            obstacle && obstacles.push(obstacle);
        });
    }

    await pool.waitUntilFinishedAndClose();
    console.log(obstacles.length);

}

const { grid, start } = await parse();

part1(grid, start);
part2(grid, start);