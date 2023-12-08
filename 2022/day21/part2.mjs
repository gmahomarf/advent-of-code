import { getInput } from "../../utils/input.mjs";

const input = await getInput();

const opOp = {
    '+': '-',
    '-': '+',
    '*': '/',
    '/': '*',
}

const HUMAN = 'humn';

function doOp(op, left, right) {
    switch (op) {
        case '*': return left * right;
        case '+': return left + right;
        case '-': return left - right;
        case '/': return left / right;
        default: throw new Error(`unknown ${op}`)
    }
}

function toPrefixNotation(monkeys, name) {
    const monkey = monkeys[name];
    if (monkey.length === 1) {
        return monkey;
    }

    return [monkey[0]].concat(toPrefixNotation(monkeys, monkey[1])).concat(toPrefixNotation(monkeys, monkey[2]));
}


function findPathToHuman(monkeys) {
    const path = ['root'];
    const visited = new Set('root');
    let m;
    while (m = path.shift()) {
        visited.add(m);
        if (m === HUMAN) {
            break;
        }
        const monkey = monkeys[m];
        if (monkey.length === 3) {
            if (!visited.has(monkey[1])) {
                path.unshift(monkey[1], m);
            } else if (!visited.has(monkey[2])) {
                path.unshift(monkey[2], m);
            }
        }
    }
    return path;
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

    invertHumanPath(monkeys, findPathToHuman(monkeys));

    const formula = toPrefixNotation(monkeys, HUMAN);
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

function invertHumanPath(monkeys, path) {
    let prev = HUMAN;
    for (const monkey of path) {
        const [op, left, right] = monkeys[monkey];
        if (monkey === 'root') {
            monkeys[prev] = prev === left ? monkeys[right] : monkeys[left];
        } else if (left === prev) {
            monkeys[prev] = [opOp[op], monkey, right];
        } else if (right === prev) {
            /// m = l + p <==> p = m - l
            /// m = l * p <==> p = m / l
            /// m = l - p <==> p = l - m
            /// m = l / p <==> p = l / m
            if (op === '+' || op === '*') {
                monkeys[prev] = [opOp[op], monkey, left];
            } else {
                monkeys[prev] = [op, left, monkey];
            }
        }
        prev = monkey;
    }
}

