import readline from 'node:readline';
import { setTimeout } from 'node:timers/promises';
import { getInput } from '../../utils/index';

const input = await getInput();

const ROUNDS = 10000;
const monkeys = [];
let monkeyIndex = -1;

const divs = new Set();
const dbg = process.env.DEBUG;
const timeout = +(process.argv[2] || '25');
async function debug(round, monkeys, wait) {
    if (dbg) {
        await printMonkeys(round, monkeys, wait);
        await setTimeout(timeout);
    }
}

async function printMonkeys(round, monkeys, wait) {
    console.clear();
    console.log(`Round ${round}`);
    for (const [id, { items, inspections }] of Object.entries(monkeys)) {
        console.log(`Monkey ${id}: [${items.join(', ')}] => ${inspections} times`);
    }
    if (wait) {
        const prompt = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        await new Promise(resolve => {
            prompt.question('cont?', () => {
                prompt.close();
                resolve();
            });
        });
    }
}

for (const line of input.lines()) {
    const [label, arg] = line.split(':');
    if (label.startsWith('Monkey')) {
        monkeyIndex = +label.split(' ')[1];
        monkeys[monkeyIndex] = { id: monkeyIndex, inspections: 0 };
    } else if (label.startsWith('  Starting')) {
        monkeys[monkeyIndex].items = arg.split(', ').map(i => +i.trim());
    } else if (label.startsWith('  Operation')) {
        const predicate = arg.split('= ')[1].split(' ').slice(-2);
        monkeys[monkeyIndex].op = [predicate[0], +predicate[1] || predicate[1]];
    } else if (label.startsWith('  Test')) {
        const div = +arg.split(' ').pop();
        monkeys[monkeyIndex].div = div;
        divs.add(div);
    } else if (label.startsWith('    If')) {
        const key = label.split(' ').pop()[0];
        monkeys[monkeyIndex][key] = +arg.split(' ').pop();
    }
}

const prod = [...divs].reduce((a, b) => a * b);

function doOp(left, [op, right]) {
    if (right === 'old') right = left;
    switch (op) {
        case '*': return left * right;
        case '+': return left + right;
        default: throw new Error(`unknown ${op}`);
    }
}
for (let i = 0; i < ROUNDS; i++) {
    if (i === 1 || i === 20 || !(i % 1000)) await debug(i, monkeys, true);
    for (const monkey of monkeys) {
        const { items, div, op, t, f } = monkey;
        while (items.length) {
            items[0] = doOp(items[0], op) % prod;
            const nextMonkey = monkeys[!(items[0] % div) ? t : f];
            nextMonkey.items.push(items.shift());
            monkey.inspections++;
        }
    }
}
// await debug(ROUNDS, monkeys, true)


monkeys.sort((a, b) => b.inspections - a.inspections);
// console.log(JSON.stringify(monkeys, (key, value) => {
//     if (key && Array.isArray(value)) return `[...truncated...]`;
//     if (typeof value === 'function') return value.toString();
//     return value;
// }, 2));
console.log(monkeys[0].inspections * monkeys[1].inspections);
