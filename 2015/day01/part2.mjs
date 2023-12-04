import { createReadStream } from 'node:fs';

const input = createReadStream('input.txt', 'utf-8');

let floor = 0;
let pos = 1;
main:
for await (const data of input) {
    for (const c of data) {
        c === '(' ? floor++ : floor--;
        if (floor === -1) {
            break main;
        }
        pos++;
    }
}

console.log(pos)