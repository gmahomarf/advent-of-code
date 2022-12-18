import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const cubes = {};

for await (const line of input) {
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

console.log(cubes);
console.log(sides);
