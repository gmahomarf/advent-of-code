import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

/**
 *
 * @param {string[]} b
 */
function getStacks(b) {
    const stacks = b.pop().match(/ (.)  ?/g);
    const r = new Array(stacks.length).fill(1).map(_ => []);

    for (let line = b.pop(); line; line = b.pop()) {
        const crates = line.match(/(?:\[([A-Z])\]| ( ) ) ?/g);
        crates.forEach((c, i) => {
            c.trim() && r[i].push(c.trim().slice(1, -1));
        })
    }

    return r;
}

let buf = [];
let done = false;
let stacks;
for await (const line of input) {
    if (!done && line) {
        buf.push(line);
        continue;
    } else if (!done) {
        done = true
        stacks = getStacks(buf);
    }

    if (!line) continue;

    let [c, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/).slice(1).map(i => +i);
    stacks[to - 1].push(...stacks[from - 1].splice(-c));
}

console.log(stacks.map(s => s.pop() || ' ').join(''));
