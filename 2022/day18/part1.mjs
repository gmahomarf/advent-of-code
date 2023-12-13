import { getInput } from '../../utils/index.mjs';

const input = await getInput();

const cubes = {};

for (const line of input.lines()) {
    cubes[line] = true;
}

let sides = 0;

for (const cube of Object.keys(cubes)) {
    let vs = 6;
    const [x, y, z] = cube.split(',').map(n => +n);
    if (cubes[`${x - 1},${y},${z}`]) vs--;
    if (cubes[`${x + 1},${y},${z}`]) vs--;
    if (cubes[`${x},${y - 1},${z}`]) vs--;
    if (cubes[`${x},${y + 1},${z}`]) vs--;
    if (cubes[`${x},${y},${z - 1}`]) vs--;
    if (cubes[`${x},${y},${z + 1}`]) vs--;

    sides += vs;
}

console.log(sides);
