import { getExampleInput, getInput, combinations, setPartitions } from '../../utils/index';

async function parse(n?: number) {
    const input = await getInput(n);
    const keys: number[][] = [];
    const locks: number[][] = [];

    let height;
    for (const item of input.splitByEmptyLines()) {
        height = item.length;
        if (item[0] === '#####') {
            const lock: number[] = [0, 0, 0, 0, 0];
            for (const line of item.slice(1)) {
                for (let i = 0; i < 5; i++) {
                    if (line[i] === '#') {
                        lock[i]++;
                    }
                }
            }
            locks.push(lock);
        } else {
            const key: number[] = [0, 0, 0, 0, 0];
            for (const line of item.slice(0, -1)) {
                for (let i = 0; i < 5; i++) {
                    if (line[i] === '#') {
                        key[i]++;
                    }
                }
            }
            keys.push(key);
        }
    }

    return {
        height: height!,
        locks,
        keys,
    };
}

function part1(height: number, locks: number[][], keys: number[][]) {
    let c = 0;
    for (const lock of locks) {
        for (const key of keys) {
            if (key.every((p, i) => p + lock[i] < height - 1)) {
                c++;
            }
        }
    }

    console.log(c);
}

const { height, locks, keys } = await parse();

part1(height, locks, keys)

