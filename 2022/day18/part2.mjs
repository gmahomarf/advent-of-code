import { getInput } from '../../utils/index';

const input = await getInput();

const cubes = {};
let minx = 600,
    miny = 600,
    minz = 600;
let maxx = 0,
    maxy = 0,
    maxz = 0;

for (const line of input.lines()) {
    cubes[line] = true;
    const [x, y, z] = line.split(',').map(n => +n);
    minx = Math.min(minx, x - 1);
    miny = Math.min(miny, y - 1);
    minz = Math.min(minz, z - 1);
    maxx = Math.max(maxx, x + 1);
    maxy = Math.max(maxy, y + 1);
    maxz = Math.max(maxz, z + 1);
}

let sides = 0;
let is = 0;
const measured = new Set();

for (let x = minx; x <= maxx; x++) {
    for (let y = miny; y <= maxy; y++) {
        for (let z = minz; z <= maxz; z++) {
            const cube = `${x},${y},${z}`;
            if (cubes[cube]) {
                let vs = 6;
                if (cubes[`${x - 1},${y},${z}`]) vs--;
                if (cubes[`${x + 1},${y},${z}`]) vs--;
                if (cubes[`${x},${y - 1},${z}`]) vs--;
                if (cubes[`${x},${y + 1},${z}`]) vs--;
                if (cubes[`${x},${y},${z - 1}`]) vs--;
                if (cubes[`${x},${y},${z + 1}`]) vs--;
                sides += vs;
            } else {
                if (!measured.has(cube)) {
                    const q = [cube];
                    const visited = new Set([cube]);
                    let isds = 0;
                    let c;
                    let out = false;
                    while (c = q.shift()) {
                        const [cx, cy, cz] = c.split(',').map(n => +n);
                        const adj = [
                            ...(cx > minx ? [`${cx - 1},${cy},${cz}`] : (out = true, [])),
                            ...(cx < maxx ? [`${cx + 1},${cy},${cz}`] : (out = true, [])),
                            ...(cy > miny ? [`${cx},${cy - 1},${cz}`] : (out = true, [])),
                            ...(cy < maxy ? [`${cx},${cy + 1},${cz}`] : (out = true, [])),
                            ...(cz > minz ? [`${cx},${cy},${cz - 1}`] : (out = true, [])),
                            ...(cz < maxz ? [`${cx},${cy},${cz + 1}`] : (out = true, [])),
                        ];
                        for (const a of adj) {
                            if (cubes[a]) {
                                isds++;
                            } else if (!visited.has(a)) {
                                q.push(a);
                                visited.add(a);
                            }
                        }
                    }
                    if (!out) {
                        is += isds;
                    }
                    visited.forEach(v => measured.add(v));
                }
            }
        }
    }
}

// console.log(cubes);
// console.log('   droplets total sfc area:', sides);
// console.log('  air pockets ext sfc area:', is);
// console.log('            total droplets:', Object.keys(cubes).length);
// console.log('           total empty air:', measured.size);
// console.log('              total volume:', (maxx - minx + 1) * (maxy - miny + 1) * (maxz - minz + 1));
console.log('     droplets ext sfc area:', sides - is);
