import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const input = createInterface(createReadStream('input.txt', 'utf8'));

const lines = input[Symbol.asyncIterator]();

const instructions = (await lines.next()).value;
await lines.next();

const nodes = {}

for await (const line of lines) {
    const node = line.slice(0, 3);
    nodes[node] = {
        L: line.slice(7, 10),
        R: line.slice(12, 15),
    }
}

let curr = 'AAA';
let i;
for (i = 0; curr !== 'ZZZ'; i++) {
    curr = nodes[curr][instructions[i % instructions.length]];
}

console.log(i)
