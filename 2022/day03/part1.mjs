import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import readline from 'node:readline';

const al = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const rl = readline.createInterface(createReadStream('input.txt', 'utf8'));

let sum = 0;
for await (const rs of rl) {
    const a = rs.slice(0, rs.length/2);
    const b = rs.slice(rs.length/2);

    for (const c of a) {
        if (b.indexOf(c) !== -1) {
            sum += al.indexOf(c);
            break;
        }
    }
}

console.log(sum)