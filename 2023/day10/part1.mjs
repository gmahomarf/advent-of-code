import { getExampleInput, getInput } from '../../utils/input.mjs';

const input = await getInput();
// const input = await getExampleInput(2);

const grid = [];
let y = 0;
let start;
for (const line of input.lines()) {
    grid.push(line.split(''));
    let x = line.indexOf('S');

    if (x >= 0) {
        start = { x, y };
    }
    y++;
}

const directions = {
    N: { delta: [0, -1], pipes: ['|', '7', 'F'] },
    E: { delta: [1, 0], pipes: ['-', '7', 'J'] },
    S: { delta: [0, 1], pipes: ['|', 'J', 'L'] },
    W: { delta: [-1, 0], pipes: ['-', 'L', 'F'] },
};

const pipes = {
    '-': {
        E: { delta: [1, 0], dir: 'E' },
        W: { delta: [-1, 0], dir: 'W' },
    },
    '|': {
        N: { delta: [0, -1], dir: 'N' },
        S: { delta: [0, 1], dir: 'S' },
    },
    'L': {
        W: { delta: [-1, -1], dir: 'N' },
        S: { delta: [1, 1], dir: 'E' },
    },
    'F': {
        N: { delta: [1, -1], dir: 'E' },
        W: { delta: [-1, 1], dir: 'S' },
    },
    '7': {
        N: { delta: [-1, -1], dir: 'W' },
        E: { delta: [1, 1], dir: 'S' },
    },
    'J': {
        E: { delta: [1, -1], dir: 'N' },
        S: { delta: [-1, 1], dir: 'W' },
    },
};

let currPos = { ...start };
let currDir;
let currDelta;

for (const d in directions) {
    const { delta, pipes } = directions[d];
    if (pipes.includes(grid[currPos.y + delta[1]][currPos.x + delta[0]])) {
        currDir = d;
        currDelta = directions[currDir].delta;
        break;
    }
}

let c = 0;
do {
    const pipe = grid[currPos.y + currDelta[1]][currPos.x + currDelta[0]];
    if (pipe === 'S') {
        ++c;
        break;
    }
    const { delta, dir } = pipes[pipe][currDir];
    currPos.x += currDelta[0];
    currPos.y += currDelta[1];
    currDir = dir;
    currDelta = directions[currDir].delta;
    c++;
} while (currPos.x !== start.x || currPos.y !== start.y);

console.log(c / 2);
