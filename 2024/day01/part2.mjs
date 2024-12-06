import { getExampleInput, getInput } from '../../utils/index';

const input = await getInput();

const l = [], r = [];

for await (const line of input.lines()) {
    const s = line.split(/\s+/);
    l.push(parseInt(s[0]));
    r.push(parseInt(s[1]));
}

const rc = r.reduce((acc, v) => {
    acc[v] ??= 0;
    return acc[v]++, acc;
}, {});

const sim = l.reduce((acc, v) => {
    return acc + v * (rc[v] ?? 0);
}, 0);

console.log(sim);