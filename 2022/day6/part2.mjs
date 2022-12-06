import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const len = 14;

for await (const line of input) {
    const buf = [...line.slice(0,len)];
    let i = len;
    for (const c of line.slice(len)) {
        const o = Object.create(null);
        for (const l of buf) {
            o[l] = 1;
        }
        if (Object.keys(o).length === len) {
            console.log(i);
            break;
        }
        buf.shift();
        buf.push(c);
        i++;
    }
}
