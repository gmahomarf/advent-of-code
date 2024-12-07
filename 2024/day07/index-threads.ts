import { getExampleInput, getInput, mul, add } from '../../utils/index';
import { WorkerPool } from '../../utils/worker-pool';

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

function solve(equations: number[][]) {
    let sums = [0, 0];
    const pool = new WorkerPool<unknown, number>('./solve.ts');
    for (const equation of equations) {
        pool.runTask({ equation, part: 1 }, (_, r) => {
            sums[0] += r!;
        })
        pool.runTask({ equation, part: 2 }, (_, r) => {
            sums[1] += r!;
        })
    }

    pool.on('finished', () => {
        console.log(sums);
        pool.close();
    })
}

const { equations } = await parse();

solve(equations);