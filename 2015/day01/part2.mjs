import { getExampleInput, getInput } from '../../utils/input.mjs';

// const input = await getExampleInput();
const input = await getInput();

let floor = 0;
let pos = 1;

for (const c of input) {
    c === '(' ? floor++ : floor--;
    if (floor === -1) {
        break;
    }
    pos++;
}

console.log(pos)
