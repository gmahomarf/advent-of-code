import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf8');
const [times, distances] = input.split('\n').map(l => l.split(/ +/).slice(1).map(Number));

let r = 1;
for (const [i, time] of times.entries()) {
    for (let p = 1; p < time; p++) {
        if ((time - p) * p > distances[i]) {
            r *= time - 2 * p + 1;
            break;
        }
    }
}

console.log(r)