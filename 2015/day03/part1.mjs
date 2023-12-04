import { createReadStream } from 'node:fs';

const input = createReadStream('input.txt', 'utf-8');

let x = 0, y = 0;
const moves = {
    '>': [0, 1],
    '<': [0, -1],
    '^': [1, 0],
    'v': [-1, 0],
}
const houses = {
    '0,0': 1,
}
for await (const data of input) {
    for (const c of data) {
        const [dx, dy] = moves[c];
        x += dx;
        y += dy;
        houses[`${x},${y}`] ??= 0;
        houses[`${x},${y}`]++;
    }
}

console.log(Object.keys(houses).length)
