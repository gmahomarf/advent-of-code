import { getExampleInput, getInput } from '../../utils/index.mjs';

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
    // const input = await getExampleInput();

    const { grid, start } = getGridAndStart(input);
    const possibleDirs = getPossibleStartingDirections(grid, start, DIRECTIONS);
    const loop = findLoop(grid, start, possibleDirs[0]);

    console.log(loop.size / 2);
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

main();
