import { getInput, lcm } from '../../utils/index';

const input = await getInput();

const lines = input.lines();

const instructions = lines.next().value;
lines.next();

const nodes = {};
const currentNodes = [];

for (const line of lines) {
    const node = line.slice(0, 3);
    nodes[node] = {
        L: line.slice(7, 10),
        R: line.slice(12, 15),
    };
    if (node[2] === 'A') {
        currentNodes.push(node);
    }
}

const ends = [];
for (let i = 0; ends.filter(x => x).length < currentNodes.length; i++) {
    for (const [n, curr] of currentNodes.entries()) {
        if (ends[n]) continue;
        currentNodes[n] = nodes[curr][instructions[i % instructions.length]];
        if (currentNodes[n][2] === 'Z') ends[n] ??= i + 1;
    }
}

console.log(lcm(...ends));
