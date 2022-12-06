import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

let count = 0;
for await (const pairs of input) {
    const [a, b] = pairs.split(',').map(a => a.split('-').map(n => parseInt(n,10))).sort((a,b) => a[0] - b[0]);

    if (a[1] >= b[0]) {
        count++;
    }

}

console.log(count)