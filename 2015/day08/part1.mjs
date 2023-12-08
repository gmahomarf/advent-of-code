import { getExampleInput, getInput } from '../../utils/input.mjs';

// const input = await getExampleInput();
const input = await getInput();

let sum = 0;

for (const line of input.lines()) {
    sum += line.length - eval(line).length;
}

console.log(sum);
