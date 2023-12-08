import { getExampleInput, getInput } from '../../utils/input.mjs';

// const input = await getExampleInput();
const input = await getInput();

let paper = 0;
for (const box of input.lines()) {
    const d = box.split('x').map(Number).sort((a, b) => a - b);
    paper += 2 * (d[0] * d[1] + d[1] * d[2] + d[0] * d[2]) + d[0] * d[1];
}

console.log(paper)
