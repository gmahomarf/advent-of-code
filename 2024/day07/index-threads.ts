import { isMainThread, parentPort } from 'worker_threads';
import { getExampleInput, getInput } from '../../utils/index';
import { WorkerPool } from '../../utils/worker-pool';
import { solve } from './solve';

async function parse() {
    const input = await getInput();
    const equations: number[][] = [];
    for await (const line of input.lines()) {
        equations.push(line.split(/:? /).map(Number));
    }

    return {
        equations,
    };
}

function run(equations: number[][]) {
    let sums = [0, 0];
    const pool = new WorkerPool<unknown, number>(new URL(import.meta.url));
    for (const equation of equations) {
        pool.runTask({ equation, part: 1 }, (_, r) => {
            sums[0] += r;
        })
        pool.runTask({ equation, part: 2 }, (_, r) => {
            sums[1] += r;
        })
    }

    pool.on('finished', () => {
        console.log(sums);
        pool.close();
    })
}

if (!parentPort) {
    const { equations } = await parse();
    run(equations);
} else {
    parentPort.on('message', (task) => {
        parentPort!.postMessage(solve(task));
    });
}