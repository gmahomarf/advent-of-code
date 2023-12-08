import readline from 'node:readline';
import { setTimeout } from 'node:timers/promises';
import { getInput } from "../../utils/input.mjs";

const input = await getInput();

const { floor } = Math;
const ROUNDS = 20;
const monkeys = [];
let monkeyIndex = -1;

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
    for (const { id, items } of monkeys) {
        console.log(`Monkey ${id}: [${items.join(', ')}]`)
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
        monkeys[monkeyIndex].op = new Function('old', 'return ' + arg.split('=')[1]);
    } else if (label.startsWith('  Test')) {
        const div = +arg.split(' ').pop()
        monkeys[monkeyIndex].test = new Function('item', `return !(item % ${div})`);
    } else if (label.startsWith('    If')) {
        const key = label.split(' ').pop()[0];
        monkeys[monkeyIndex][key] = +arg.split(' ').pop();
    }
}


// dbg && console.log(JSON.stringify(monkeys, (key, value) => {
//     if (key && Array.isArray(value)) return `[${value.join(', ')}]`;
//     if (typeof value === 'function') return value.toString();
//     return value;
// }, 2));

for (let i = 0; i < ROUNDS; i++) {
    for (const monkey of monkeys) {
        const { items, test, op, t, f } = monkey;
        await debug(i, monkeys);
        while (items.length) {
            items[0] = op(items[0]);
            await debug(i, monkeys);
            items[0] = floor(items[0] / 3);
            await debug(i, monkeys);
            monkeys[test(items[0]) ? t : f].items.push(items.shift());
            await debug(i, monkeys);
            monkey.inspections++;
        }
    }
}

dbg && console.log(JSON.stringify(monkeys, (key, value) => {
    if (key && Array.isArray(value)) return `[${value.join(', ')}]`;
    if (typeof value === 'function') return value.toString();
    return value;
}, 2));

monkeys.sort((a, b) => b.inspections - a.inspections);
console.log(monkeys[0].inspections * monkeys[1].inspections)
