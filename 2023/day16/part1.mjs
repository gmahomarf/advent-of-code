import { Grid, getExampleInput, getInput, add } from '../../utils/index';

main();

const MIRRORS = {
    '/': {
        '^': '>',
        '>': '^',
        'v': '<',
        '<': 'v',
    },
    '\\': {
        '^': '<',
        '>': 'v',
        'v': '>',
        '<': '^',
    },
};

const SPLITTERS = {
    '-': {
        '^': ['>', '<'],
        'v': ['>', '<'],
    },
    '|': {
        '<': ['^', 'v'],
        '>': ['^', 'v'],
    },
};

const DIRECTIONS = {
    '^': { x: 0, y: -1 },
    '>': { x: 1, y: 0 },
    'v': { x: 0, y: 1 },
    '<': { x: -1, y: 0 },
};

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    const grid = new Grid();
    for (const line of input.lines()) {
        grid.push(line.split(''));
    }

    const beams = [{
        x: 0,
        y: 0,
        d: '>',
        visited: new Set(),
    }];

    let beam;
    const energized = new Set();
    while (beam = beams.shift()) {
        const newBeams = moveBeam(grid, beam, energized);
        beams.push(...newBeams);
    }

    // print(grid);
    console.log(energized.size);
}

function print(grid) {
    console.log(grid.map(l => l.join('')).join('\n'), '\n');
}

function moveBeam(grid, beam, energized) {
    while (1) {
        if (beam.y >= grid.length || beam.y < 0 || beam.x < 0 || beam.x >= grid[0].length) {
            return [];
        }
        if (beam.visited.has(`${beam.x},${beam.y},${beam.d}`)) {
            return [];
        }

        const p = grid[beam.y][beam.x];
        beam.visited.add(`${beam.x},${beam.y},${beam.d}`);
        energized.add(`${beam.x},${beam.y}`);

        if (p === '.') {
            grid[beam.y][beam.x] = beam.d;
        } else if (p in MIRRORS) {
            beam.d = MIRRORS[p][beam.d];
        } else if (p in SPLITTERS) {
            if (SPLITTERS[p][beam.d]) {
                return SPLITTERS[p][beam.d].map(d => {
                    const dir = DIRECTIONS[d];
                    return {
                        x: beam.x + dir.x,
                        y: beam.y + dir.y,
                        d,
                        visited: beam.visited
                    };
                });
            }
        }


        // print(grid);

        const dir = DIRECTIONS[beam.d];
        beam.x += dir.x;
        beam.y += dir.y;
    }
}
