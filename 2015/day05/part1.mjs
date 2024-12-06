import { getExampleInput, getInput } from '../../utils/index';

// const input = await getExampleInput();
const input = await getInput();

let nice = 0;
for (const line of input.lines()) {
    if (
        ['ab', 'cd', 'pq', 'xy'].reduce((b, s) => b || line.includes(s), false)
        || !/([a-z])\1/.test(line)
        || !/([aeiou].*){3,}/.test(line)
    ) {
        continue;
    }
    nice++;
}

console.log(nice);
