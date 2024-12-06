import { getExampleInput, getInput, Grid, Point } from '../../utils/index.mjs';

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

function hasLoop(grid, start) {
    const pos = start.clone();
    const steps = new Set();
    for (let i = 0; ; i = ++i % 4) {
        const direction = directionOrder[i];
        while (1) {
            const step = direction + pos.toString();
            if (steps.has(step)) {
                return true;
            }
            steps.add(step);
            if (grid.getAt(pos.clone()[direction]()) !== '.') {
                break;
            }
            pos[direction]();
        }

        if (pos.y === 0 || pos.y === grid.height - 1 || pos.x === 0 || pos.x === grid.width - 1) {
            break;
        }
    }

    return false;
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
function part2(grid, start) {
    const pos = start.clone();
    const visited = getAllVisited(grid, pos);
    const obstacles = [];

    for (const y in grid) {
        for (const x in grid[y]) {
            const p = new Point(+x, +y);
            if (!visited.has(p.toString()) || p.equals(start)) {
                continue;
            }
            const clone = grid.clone();
            clone.setAt(p, '#');
            if (hasLoop(clone, pos)) {
                obstacles.push(p);
            }
        }
    }

    console.log(obstacles.length);
}

const { grid, start } = await parse();

part1(grid, start);
part2(grid, start);