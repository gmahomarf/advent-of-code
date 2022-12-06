import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import readline from 'node:readline';

const al = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const rl = readline.createInterface(createReadStream('input.txt', 'utf8'));

let sum = 0;
const buf = [];
for await (const rs of rl) {
    buf.push(rs);
    if (buf.length < 3) {
        continue;
    }

    for (const c of buf[0]) {
        if (buf[1].indexOf(c) !== -1 && buf[2].indexOf(c) !== -1) {
            sum += al.indexOf(c);
            break;
        }
    }
    buf.length = 0;
}

console.log(sum)