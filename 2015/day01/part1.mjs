import { getExampleInput, getInput } from '../../utils/index.mjs';

// const input = await getExampleInput();
const input = await getInput();

let floor = 0;

for (const c of input) {
    c === '(' ? floor++ : floor--;
}

console.log(floor);
