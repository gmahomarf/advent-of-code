import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import process from 'node:process';
import { setTimeout } from 'node:timers/promises';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const { min, max } = Math;

const DIRECTIONS = {
    N: [0, -1],
    S: [0, 1],
    W: [-1, 0],
    E: [1, 0],
};

const ORDER = ['N', 'S', 'W', 'E'];
const ROUNDS = Infinity;

async function run() {
    const elves = [];
    const elfPositions = {};
    let y = 0;
    let top = Infinity,
        bottom = -Infinity,
        left = Infinity,
        right = -Infinity;
    for await (const line of input) {
        for (const [x, c] of Object.entries(line)) {
            if (c === '#') {
                elves.push({ x, y });
                elfPositions[`${x},${y}`] = 1;
            }
        }
        y++;
    }

    for (let i = 0; i < ROUNDS; i++) {
        const moves = {};
        const firstDir = i % ORDER.length;
        let anyElf = false;
        for (const elf of Object.keys(elfPositions)) {
            const [x, y] = elf.split(',').map(i => +i);
            let move, elves = false;
            for (let d = 0; d < 4; d++) {
                const dir = ORDER[(d + firstDir) % ORDER.length];
                const [dx, dy] = DIRECTIONS[dir];
                if (dir === 'N' || dir === 'S') {
                    const [ex, ey] = DIRECTIONS['E'];
                    const [wx, wy] = DIRECTIONS['W'];
                    if (!elfPositions[`${x + dx},${y + dy}`] && !elfPositions[`${x + dx + ex},${y + dy + ey}`] && !elfPositions[`${x + dx + wx},${y + dy + wy}`]) {
                        if (!move) {
                            move = [x + dx, y + dy];
                        }
                    } else {
                        elves = true;
                    }
                } else {
                    const [nx, ny] = DIRECTIONS['N'];
                    const [sx, sy] = DIRECTIONS['S'];
                    if (!elfPositions[`${x + dx},${y + dy}`] && !elfPositions[`${x + dx + nx},${y + dy + ny}`] && !elfPositions[`${x + dx + sx},${y + dy + sy}`]) {
                        if (!move) {
                            move = `${x + dx},${y + dy}`;
                        }
                    } else {
                        elves = true;
                    }
                }
            }
            if (move && elves) {
                ;
                moves[move] ||= [];
                moves[move].push(elf);
            }
        }

        for (const [move, elves] of Object.entries(moves)) {
            if (elves.length === 1) {
                anyElf = true;
                const [x, y] = move.split(',').map(i => +i);
                top = min(top, y);
                bottom = max(bottom, y);
                left = min(left, x);
                right = max(right, x);
                delete elfPositions[elves[0]];
                elfPositions[move] = 1;
            }
        }
        if (!anyElf) {
            console.log(i + 1);
            break;
        }
    }

    // console.log(top, bottom, left, right, Object.keys(elfPositions).length);
    // console.log((bottom - top + 1) * (right - left + 1) - Object.keys(elfPositions).length)
    // for (let y = top; y <= bottom; y++) {
    //     let l = '';
    //     for (let x = left; x <= right; x++) {
    //         l += elfPositions[`${x},${y}`] ? '#' : '.'
    //     }
    //     console.log(l);
    // }
}

await run();
