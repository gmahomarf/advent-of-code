import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import process from 'node:process';
import { setTimeout } from 'node:timers/promises';

// const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const WALL = '#';
const TILE = '.';

const { DEBUG } = process.env;
const TIMEOUT = +(process.argv[2] ?? 100);

const DIRECTIONS = {
    U: [0, -1],
    D: [0, 1],
    L: [-1, 0],
    R: [1, 0],
};

const TURNS = {
    R: {
        R: 'D',
        L: 'U',
    },
    D: {
        R: 'L',
        L: 'R',
    },
    L: {
        R: 'U',
        L: 'D',
    },
    U: {
        R: 'R',
        L: 'L',
    },
}

const VALUES = {
    U: 3,
    R: 0,
    D: 1,
    L: 2,
}
const ARROWS = {
    R: '>',
    L: '<',
    D: 'v',
    U: '^',
}

async function drawGrid(jungle, pos, dir, moves) {
    console.clear();
    for (const y in jungle) {
        console.log(jungle[y].map((v, x) => {
            return pos[0] === x && pos[1] === +y ? ARROWS[dir] : v;
        }).join(''))
    }
    console.log('Moves:', moves);
    await setTimeout(TIMEOUT);
}

async function run() {
    const jungle = [];
    let done = false;
    const re = /(\d+)([RL])?/g;
    const moves = [];
    for await (const line of input) {
        if (!line) {
            done = true;
            continue;
        }
        if (!done) {
            const row = line.split('');
            row.start = row.findIndex(c => c !== ' ');
            row.end = row.length - 1;
            jungle.push(row);
        } else {
            for (const match of line.matchAll(re)) {
                moves.push(+match[1]);
                match[2] && moves.push(match[2]);
            }
        }
    }

    // console.log(jungle);
    // console.log(moves);
    // process.exit();
    let pos = [jungle[0].start, 0];
    let dir = 'R';

    for (const move of moves) {
        if (typeof move === 'number') {
            const [dx, dy] = DIRECTIONS[dir];
            for (let i = move; i > 0; i--) {
                DEBUG && await drawGrid(jungle, pos, dir, i)
                const [x, y] = pos;
                let start, end;
                if (dx) {
                    start = jungle[y].start;
                    end = jungle[y].end;
                } else {
                    start = jungle.findIndex(r => r[x] !== ' ');
                    const e = jungle.slice(start).findIndex(r => r.end < x || r[x] === ' ');
                    end = e === -1 ? jungle.length - 1 : e + start - 1;
                }
                // const start = dx ? jungle[y].start : jungle.findIndex(r => r[x] !== ' ');
                // const end = dx ? jungle[y].end : jungle.slice(start).findIndex(r => r[x] === ' ') ?? jungle.length - 1;
                let nx, ny;
                if (dx) {
                    const n = x + dx;
                    if (n > end) {
                        nx = start;
                    } else if (n < start) {
                        nx = end;
                    } else {
                        nx = n;
                    }
                    ny = y;
                } else {
                    const n = y + dy;
                    if (n > end) {
                        ny = start;
                    } else if (n < start) {
                        ny = end;
                    } else {
                        ny = n;
                    }
                    nx = x;
                }
                // const nx = dx ? (x - start + dx) % (end - start + 1) + start : x;
                // const ny = dy ? (y - start + dy) % (end - start + 1) + start : y;

                if (jungle[ny][nx] === '.') {
                    pos = [nx, ny];
                } else if (jungle[ny][nx] === '#') {
                    break;
                } else {
                    throw new Error('Out of bounds');
                }
            }
        } else {
            dir = TURNS[dir][move];
        }
        DEBUG && await drawGrid(jungle, pos, dir, 0)
    }

    console.log(pos);
    console.log(dir);
    console.log((pos[1] + 1) * 1000 + (pos[0] + 1 ) * 4 + VALUES[dir]);
}

await run();
