import { getExampleInput, getInput, add } from '../../utils/index';
import { Matrix } from '../../utils/matrix';

async function parse() {
    const input = await getInput();
    const matrices: Matrix[] = [];
    for (const [a, b, prize] of input.splitByEmptyLines()) {
        const [ax, ay] = a.split(': ').slice(1).flatMap(xy => xy.split(', ').flatMap(c => +c.split('+')[1]))
        const [bx, by] = b.split(': ').slice(1).flatMap(xy => xy.split(', ').flatMap(c => +c.split('+')[1]))
        const [px, py] = prize.split(': ').slice(1).flatMap(xy => xy.split(', ').flatMap(c => +c.split('=')[1]))

        matrices.push(new Matrix([
            [ax, bx, px],
            [ay, by, py]
        ]));
    }

    return {
        matrices,
    };
}

const A = 3;
const B = 1;

function part1(matrices: Matrix[]) {
    const winners: [number, number][] = [];
    for (const m of matrices) {
        const [a, b] = m.solveLinearSystem();
        if (Number.isInteger(a) && a <= 100 && Number.isInteger(b) && b <= 100) {
            winners.push([a, b]);
        }
    }
    console.log(winners.map(w => w[0] * A + w[1] * B).reduce(add));
}

function part2(matrices: Matrix[]) {
    const winners: [number, number][] = [];
    matrices.forEach(m => [...m].forEach(sm => sm[2] += 10000000000000))
    for (const m of matrices) {
        const [a, b] = m.solveLinearSystem();
        if (Number.isInteger(a) && Number.isInteger(b)) {
            winners.push([a, b]);
        }
    }
    console.log(winners.map(w => w[0] * A + w[1] * B).reduce(add));
}

const { matrices } = await parse();
part1(matrices);
part2(matrices);
