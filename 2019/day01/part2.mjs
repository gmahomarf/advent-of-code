import { getInput } from '../../utils/index.mjs';

const input = await getInput();

function fuelCost(f) {
    return Math.max(((f / 3) | 0) - 2, 0);
}

function rFuelCost(f) {
    let r = 0;
    let s = f;

    while ((s = fuelCost(s)) > 0) {
        r += s;
    }

    return r;
}

console.log([...input.lines()].reduce((s, x) => s + rFuelCost(x), 0));
