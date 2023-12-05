import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

import { availableParallelism } from 'node:os';
import WorkerPool from '../../utils/worker-pool.mjs';
import { URL } from 'node:url';

const cpus = availableParallelism();
const pool = new WorkerPool(cpus, new URL('./runner.mjs', import.meta.url));
const input = createInterface(createReadStream('input.txt', 'utf8'));

const seeds = [];
const maps = {};
const path = [];
let totalSeeds = 0;

let map;
for await (const line of input) {
    if (!seeds.length) {
        seeds.push(...getSeeds(line.split(' ').slice(1).map(Number)));
        continue;
    }

    if (!line.length) {
        map = null;
        continue;
    }

    if (!map) {
        map = line.slice(0, -5);
        maps[map] = [];
        path.push(map);
        continue;
    }

    const [dest, src, n] = line.split(' ').map(Number);

    maps[map].push({
        src,
        dest,
        n
    });
}

for (const map of Object.values(maps)) {
    map.sort((a, b) => a.src - b.src)
}

let lowest = Infinity;
let finished = 0;
let no = 0;
for await (const batch of splitSeeds(seeds, Math.ceil(totalSeeds / cpus))) {
    pool.runTask({ seeds: batch, maps, no: ++no, path }, (err, low) => {

        lowest = Math.min(lowest, low);
        console.log(`Finished batch ${no}: ${low}`);
        console.log(`New lowest: ${lowest}`);
        if (finished === 8) {
            pool.close();
            console.log(lowest);
            process.exit();
        }
    })
}

function* splitSeeds(seeds, batchSize) {
    let batch = [];
    let s;
    let wanted = batchSize;
    for (const seed of seeds) {
        const s = { ...seed };
        while (1) {
            if (s.n >= wanted) {
                batch.push({
                    s: s.s,
                    n: wanted
                });
                s.n -= wanted;
                s.s += wanted;

                yield batch;
                batch = [];

                wanted = batchSize;

                if (s.n === 0) break;
            } else {
                batch.push({ ...s });
                wanted -= s.n;
                break;
            }
        }
    }

    if (batch.length) {
        yield batch;
    }
}

function getSeeds(seeds) {
    const r = []
    for (let i = 0; i < seeds.length; i += 2) {
        totalSeeds += seeds[i + 1];
        r.push({
            s: seeds[i],
            n: seeds[i + 1],
        })
    }

    return r;
}
