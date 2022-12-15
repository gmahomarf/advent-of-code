import { readFile } from 'node:fs/promises';

const input = await readFile('input-ex.txt', 'utf-8');

let idx = -1;
let m = -1;
const elves = input.split('\n\n').map((e, i) => {
    let t = 0;
    for (const cal of e.split('\n')) {
        t += parseInt(cal);
    }
    if (m === -1 || t > m) {
        m = t;
        idx = i;
    }

    return t;
}).sort((a,b) => b-a);

console.log(`Elf ${idx} with ${elves.shift()} calories`)