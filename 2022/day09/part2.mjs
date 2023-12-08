import readline from 'node:readline';
import { setTimeout } from 'node:timers/promises';
import { getInput } from "../../utils/input.mjs";

const { abs, sign } = Math;

const input = await getInput();

const dbg = process.env.DEBUG;
const timeout = +(process.argv[2] || '25');
const dirs = {
    U: [0, -1],
    D: [0, 1],
    L: [-1, 0],
    R: [1, 0],
}

const knots = 10;
const gridSize = 1000;
const start = (gridSize / 2) | 0;

const rope = new Array(knots).fill(1).map(_ => [start, start]);
const visited = new Set([`${start},${start}`]);

async function printGrid(rope, move, wait) {
    console.clear();
    const grid = new Array(gridSize).fill(1).map(_ => new Array(gridSize).fill('.'));
    grid[start][start] = 's';
    for (const v of visited.values()) {
        const a = v.split(',');
        const row = grid[a[1]] = grid[a[1]] || [];
        row[a[0]] = '#';
    }
    const l = rope.length - 1;
    for (const [i, knot] of Object.entries(rope.slice(0).reverse())) {
        const row = grid[knot[1]] = grid[knot[1]] || [];
        row[knot[0]] = l - i === 0 ? 'H' : l - i;
    }
    console.log(grid.map(r => r.join('')).join('\n'));
    if (wait) {
        const prompt = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        await new Promise(resolve => {
            prompt.question('cont?', () => {
                prompt.close();
                resolve();
            });
        });
    }
}

for (const line of input.lines()) {
    let [dir, c] = line.split(' ');
    // await debug(rope, [dir, `${c}/${c}`]);
    let mov = dirs[dir];
    for (let k = 0; k < c; k++) {
        rope[0][0] += mov[0];
        rope[0][1] += mov[1];
        // await debug(rope, [dir, `${c - k}/${c}`]);
        for (let i = 1; i < rope.length; i++) {
            const head = rope[i - 1];
            const tail = rope[i];
            const dx = head[0] - tail[0];
            const dy = head[1] - tail[1];

            if (abs(dx) > 1) {
                tail[0] += sign(dx);
                if (abs(dy) !== 0) tail[1] += sign(dy);
            } else if (abs(dy) > 1) {
                tail[1] += sign(dy);
                if (abs(dx) !== 0) tail[0] += sign(dx);
            }
            visited.add(`${rope[rope.length - 1][0]},${rope[rope.length - 1][1]}`)
        }
        // await debug(rope, [dir, `${c - k}/${c}`]);
    }
}
await debug(rope, 'DONE');

console.log(visited.size);
async function debug(rope, move, wait) {
    if (dbg) {
        await printGrid(rope, move, wait);
        await setTimeout(timeout);
    }
}

