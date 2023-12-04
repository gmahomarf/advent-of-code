import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const input = createInterface(createReadStream('input.txt', 'utf-8'));

let sum = 0;

for await (const line of input) {
    sum += JSON.stringify(line).length - line.length;
}

console.log(sum);
