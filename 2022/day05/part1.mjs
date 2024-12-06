import { getInput } from '../../utils/index';

const input = await getInput();

/**
 *
 * @param {string[]} b
 */
function getStacks(b) {
    const stacks = b.pop().match(/ (.)  ?/g);
    const r = new Array(stacks.length).fill(1).map(_ => []);

    for (let line = b.pop(); line; line = b.pop()) {
        const crates = line.match(/(?:\[[A-Z]+\]|   ) ?/g);
        crates.forEach((c, i) => {
            c.trim() && r[i].push(c.trim().slice(1, -1));
        });
    }

    return r;
}

let buf = [];
let done = false;
let stacks;
for (const line of input.lines()) {
    if (!done && line) {
        buf.push(line);
        continue;
    } else if (!done) {
        done = true;
        stacks = getStacks(buf);
    }

    if (!line) continue;

    let [c, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/).slice(1).map(i => +i);
    stacks[to - 1].push(...stacks[from - 1].splice(-c).reverse());
}

console.log(stacks.map(s => s.pop() || ' ').join(''));
