import { getExampleInput, getInput, mul, add } from '../../utils/index';
import { solve } from './solve';

const input = await getInput();

async function parse() {
    const equations: number[][] = [];
    for await (const line of input.lines()) {
        equations.push(line.split(/:? /).map(Number));
    }

    return {
        equations,
    };
}

function concat(a: number, b: number): number {
    return Number('' + a + b);
}

function part1(equations: number[][]) {
    console.log(equations.reduce((s, equation) => s + solve({ equation, part: 1 }), 0));
}

function part2(equations: number[][]) {
    console.log(equations.reduce((s, equation) => s + solve({ equation, part: 2 }), 0));
}

const { equations } = await parse();

part1(equations);
part2(equations);