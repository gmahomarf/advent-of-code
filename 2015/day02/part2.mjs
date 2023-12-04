import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const input = createInterface(createReadStream('input.txt', 'utf-8'));

let ribbon = 0;
for await (const box of input) {
    const d = box.split('x').map(Number).sort((a, b) => a - b);
    ribbon += 2 * (d[0] + d[1]) + d[0] * d[1] * d[2];
}

console.log(ribbon)