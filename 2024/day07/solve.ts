import { add, mul } from '../../utils/index';

function concat(a: number, b: number): number {
    return Number('' + a + b);
}

export function solve({ part, equation }: { part: 1 | 2, equation: number[] }) {
    if (part === 1) {
        return part1(equation);
    }

    return part2(equation);
}

function part1(equation: number[]) {
    const operators = [add, mul];
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
            return result;
        }
    }

    return 0;
}

function part2(equation: number[]) {
    const operators = [add, mul, concat];
    const [result, ...operands] = equation;

    const n = 3 ** (operands.length - 1);
    for (let i = 0; i < n; i++) {
        let r: number = operands[0];
        for (let idx = 1; idx < operands.length; idx++) {
            const o = operands[idx];
            // @ts-expect-error
            r = operators[(n + i).toString(3)[idx]](r, o);
            if (r > result) {
                break;
            }
        }
        if (r === result) {
            return result;
        }
    }

    return 0;
}