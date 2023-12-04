import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const input = createInterface(createReadStream('input.txt', 'utf-8'));

let nice = 0;
for await (const line of input) {
    if (
        ['ab', 'cd', 'pq', 'xy'].reduce((b, s) => b || line.includes(s), false)
        || !/([a-z])\1/.test(line)
        || !/([aeiou].*){3,}/.test(line)
    ) {
        continue;
    }
    nice++;
}

console.log(nice)
