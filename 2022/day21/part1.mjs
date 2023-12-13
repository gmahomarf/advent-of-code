import { getInput } from '../../utils/index.mjs';

const input = await getInput();

const ROOT = 'root';

function doOp(op, left, right) {
    switch (op) {
        case '*': return left * right;
        case '+': return left + right;
        case '-': return left - right;
        case '/': return left / right;
        default: throw new Error(`unknown ${op}`);
    }
}

function toPrefixNotation(monkeys, name) {
    const monkey = monkeys[name];
    if (monkey.length === 1) {
        return monkey;
    }

    return [monkey[0]].concat(toPrefixNotation(monkeys, monkey[1])).concat(toPrefixNotation(monkeys, monkey[2]));
}

async function run() {
    const monkeys = {};
    const re = /^(?:(?<n>\d+)|(?<left>\w+) (?<op>[-+*/]) (?<right>\w+))$/;
    for (const line of input.lines()) {
        const [monkey, operation] = line.split(': ');
        const match = operation.match(re);
        const { n, left, op, right } = match.groups;
        if (n) {
            monkeys[monkey] = [+n];
        } else {
            monkeys[monkey] = [op, left, right];
        }
    }

    const formula = toPrefixNotation(monkeys, ROOT);

    const stack = [];
    let c;
    while (c = formula.pop()) {
        if (typeof c === 'string') {
            stack.push(doOp(c, stack.pop(), stack.pop()));
        } else {
            stack.push(c);
        }
    }
    console.log(stack);
}

run();
