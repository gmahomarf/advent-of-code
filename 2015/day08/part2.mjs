import { getExampleInput, getInput } from '../../utils/index';

// const input = await getExampleInput();
const input = await getInput();

let sum = 0;

for (const line of input.lines()) {
    sum += JSON.stringify(line).length - line.length;
}

console.log(sum);
