import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf-8');

const you = {
    A: 1,
    B: 2,
    C: 3,
}

const me = {
    X: 1,
    Y: 2,
    Z: 3
}

let score = 0;
for (const game of input.split('\n')) {
    const [y, m] = game.split(' ');
    switch (me[m] - you[y]) {
    case 0:
        score += 3 + me[m];
        break;
    case 1:
    case -2:
        score += 6 + me[m]
        break;
    default:
        score += me[m]
    }
}

console.log(score)