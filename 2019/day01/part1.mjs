import { getInput } from '../../utils/index.mjs';

const input = await getInput();

function fuelCost(f) {
    return Math.max(((f / 3) | 0) - 2, 0);
}

console.log([...input.lines()].reduce((s, x) => s + fuelCost(x), 0));
