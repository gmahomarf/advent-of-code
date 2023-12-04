import { createReadStream } from 'node:fs';

const input = createReadStream('input.txt', 'utf-8');

let sx = 0, sy = 0;
let rx = 0, ry = 0;
const moves = {
    '>': [0, 1],
    '<': [0, -1],
    '^': [1, 0],
    'v': [-1, 0],
}
const houses = {
    '0,0': 1,
}
let i = 0;
for await (const data of input) {
    for (const c of data) {
        const [dx, dy] = moves[c];
        let pos;
        if (i & 0x1) {
            pos = `${sx += dx},${sy += dy}`;
        } else {
            pos = `${rx += dx},${ry += dy}`;
        }
        houses[pos] ??= 0;
        houses[pos]++;
        i++;
    }
}

console.log(Object.keys(houses).length)
