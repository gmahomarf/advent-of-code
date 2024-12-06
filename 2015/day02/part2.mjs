import { getExampleInput, getInput } from '../../utils/index';

// const input = await getExampleInput();
const input = await getInput();

let ribbon = 0;
for (const box of input.lines()) {
    const d = box.split('x').map(Number).sort((a, b) => a - b);
    ribbon += 2 * (d[0] + d[1]) + d[0] * d[1] * d[2];
}

console.log(ribbon);
