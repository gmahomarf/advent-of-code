import { getExampleInput, getInput } from '../../utils/index';

const input = await getInput();

const l = [], r = [];

for await (const line of input.lines()) {
    const s = line.split(/\s+/);
    l.push(parseInt(s[0]));
    r.push(parseInt(s[1]));
}

l.sortInt();
r.sortInt();

const sum = l.reduce((acc, v, i) => {
    return acc + Math.abs(v - r[i]);
}, 0);

console.log(sum);