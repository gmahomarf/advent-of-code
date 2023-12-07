import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf8');
const [time, distance] = input.split('\n').map(l => +(l.replace(/ +/g, '').split(':').pop()));

let ways = 0;
for (let p = 1; p < time; p++) {
    if ((time - p) * p > distance) {
        ways = time - 2 * p + 1;
        break;
    }
}

console.log(ways)