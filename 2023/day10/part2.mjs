import { getExampleInput, getInput } from '../../utils/input.mjs';

const DIRECTIONS = {
    N: { delta: [0, -1], pipes: ['|', '7', 'F'] },
    E: { delta: [1, 0], pipes: ['-', '7', 'J'] },
    S: { delta: [0, 1], pipes: ['|', 'J', 'L'] },
    W: { delta: [-1, 0], pipes: ['-', 'L', 'F'] },
};

const PIPES = {
    '-': {
        E: { dir: 'E' },
        W: { dir: 'W' },
    },
    '|': {
        N: { dir: 'N' },
        S: { dir: 'S' },
    },
    'L': {
        W: { dir: 'N' },
        S: { dir: 'E' },
    },
    'F': {
        N: { dir: 'E' },
        W: { dir: 'S' },
    },
    '7': {
        N: { dir: 'W' },
        E: { dir: 'S' },
    },
    'J': {
        E: { dir: 'N' },
        S: { dir: 'W' },
    },
};

async function main() {
    const input = await getInput();
    // const input = await getExampleInput(6);

    const { grid, start } = getGridAndStart(input);
    const possibleDirs = getPossibleStartingDirections(grid, start, DIRECTIONS);
    const loop = findLoop(grid, start, possibleDirs[0]);

    replaceStartPipe(grid, start, possibleDirs);
    const count = getInsideCount(grid, loop);

    console.log(grid.map(g => g.join('')).join('\n'));
    console.log(count);
}

function getInsideCount(grid, loop) {
    const map = {
        '-': '\u2500',
        '|': '\u2502',
        'F': '\u250C',
        '7': '\u2510',
        'L': '\u2514',
        'J': '\u2518',
    };
    let count = 0;
    for (let y = 0; y < grid.length; y++) {
        let inside = false;
        let prev;
        for (let x = 0; x < grid[y].length; x++) {
            const p = grid[y][x];
            if (loop.has(`${x},${y}`)) {
                if (!prev || p === '|' || p === 'L' || p === 'F') {
                    inside = !inside;
                } else if (p === 'J' && prev === 'L') {
                    inside = !inside;
                } else if (p === '7' && prev === 'F') {
                    inside = !inside;
                }

                if (p !== '-') {
                    prev = p;
                }

                grid[y][x] = map[p];
            } else if (inside) {
                grid[y][x] = 'I';
                count++;
            } else {
                grid[y][x] = '.';
            }
        }
    }
    return count;
}

function getPossibleStartingDirections(grid, start, directions) {
    const possibleDirs = [];

    for (const d in directions) {
        const { delta, pipes } = directions[d];
        if (pipes.includes(grid[start.y + delta[1]]?.[start.x + delta[0]])) {
            possibleDirs.push(d);
        }
    }
    return possibleDirs;
}

function getGridAndStart(input) {
    const grid = [];
    let y = 0;
    let start;

    for (const line of input.lines()) {
        grid.push(line.split(''));
        if (!start) {
            const x = line.indexOf('S');

            if (x >= 0) {
                start = { x, y };
            }
        }

        y++;
    }

    return { grid, start };
}

function findLoop(grid, startPos, startDir) {
    let currPos = { ...startPos };
    let currDir = startDir;
    let currDelta = DIRECTIONS[currDir].delta;
    const loop = new Set([`${startPos.x},${startPos.y}`]);

    while (1) {
        const nx = currPos.x + currDelta[0];
        const ny = currPos.y + currDelta[1];

        if (nx === startPos.x && ny === startPos.y) {
            break;
        }
        const pipe = grid[ny][nx];
        const { dir } = PIPES[pipe][currDir];
        currPos.x += currDelta[0];
        currPos.y += currDelta[1];
        currDir = dir;
        currDelta = DIRECTIONS[currDir].delta;
        loop.add(`${currPos.x},${currPos.y}`);
    }

    return loop;
}

function replaceStartPipe(grid, start, possibleDirs) {
    switch (possibleDirs[0]) {
        case 'N':
            return grid[start.y][start.x] = possibleDirs[1] === 'E' ? 'L' : 'J';
        case 'E':
            return grid[start.y][start.x] = 'F';
        case 'S':
            return grid[start.y][start.x] = '7';
    }
}

main();
