import { createReadStream } from 'node:fs';

const input = createReadStream('input.txt', 'utf-8');

let floor = 0;
for await (const data of input) {
    for (const c of data) {
        c === '(' ? floor++ : floor--;
    }
}

console.log(floor)