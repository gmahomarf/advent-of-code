import { getExampleInput, getInput } from '../../utils/index.mjs';

// const input = await getExampleInput();
const input = await getInput();

let count = 0;
for (const pairs of input.lines()) {
    const [a, b] = pairs.split(',').map(a => a.split('-').map(n => parseInt(n, 10))).sort((a, b) => a[0] - b[0]);

    if (a[1] >= b[0]) {
        count++;
    }

}

console.log(count);
