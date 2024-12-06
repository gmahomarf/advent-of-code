import { getInput } from '../../utils/index';

const input = await getInput();

const lines = input.lines();

const instructions = lines.next().value;
lines.next();

const nodes = {};

for (const line of lines) {
    const node = line.slice(0, 3);
    nodes[node] = {
        L: line.slice(7, 10),
        R: line.slice(12, 15),
    };
}

let curr = 'AAA';
let i;
for (i = 0; curr !== 'ZZZ'; i++) {
    curr = nodes[curr][instructions[i % instructions.length]];
}

console.log(i);
