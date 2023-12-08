import { getExampleInput, getInput } from '../../utils/input.mjs';

// const input = await getExampleInput();
const input = await getInput();
let sum = 0;

for (const line of input.lines()) {
    const numbers = line.split('').map(Number).filter(Number.isFinite);
    const f = numbers.shift();
    const l = numbers.pop() ?? f;
    sum += 10 * f + l;
}

console.log(sum);
