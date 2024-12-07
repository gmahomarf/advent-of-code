import { getExampleInput, getInput, mul, add } from '../../utils/index';

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
    const operators = [add, mul];
    let sum = 0;
    for (const equation of equations) {
        const [result, ...operands] = equation;

        const n = 2 ** (operands.length - 1);
        for (let i = 0; i < n; i++) {
            let r: number = operands[0];
            for (let idx = 1; idx < operands.length; idx++) {
                const o = operands[idx];
                r = operators[(n >> idx & i) && 1 || 0](r, o);
                if (r > result) {
                    break;
                }
            }
            if (r === result) {
                sum += result;
                break;
            }
        }
    }

    console.log(sum);
}

function part2(equations: number[][]) {
    const operators = [add, mul, concat];
    let sum = 0;
    for (const equation of equations) {
        const [result, ...operands] = equation;

        const n = 3 ** (operands.length - 1);
        for (let i = 0; i < n; i++) {
            let r: number = operands[0];
            for (let idx = 1; idx < operands.length; idx++) {
                const o = operands[idx];
                r = operators[(n + i).toString(3)[idx]](r, o);
                if (r > result) {
                    break;
                }
            }
            if (r === result) {
                sum += result;
                break;
            }
        }
    }

    console.log(sum);
}

const { equations } = await parse();

part1(equations);
part2(equations);