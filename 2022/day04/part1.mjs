import { getExampleInput, getInput } from '../../utils/index.mjs';

// const input = await getExampleInput();
const input = await getInput();

let count = 0;
for (const pairs of input.lines()) {
    const [a, b] = pairs.split(',').map(a => a.split('-').map(n => parseInt(n, 10)));

    if (a[0] >= b[0] && a[1] <= b[1] || b[0] >= a[0] && b[1] <= a[1]) {
        count++;
    }

}

console.log(count);
