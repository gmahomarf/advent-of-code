import { parentPort } from 'node:worker_threads';

parentPort.on('message', ({ seeds, maps, no, path }) => {
    let lowest = Infinity;
    console.log(`Started worker ${no}`)
    for (const seed of seeds) {
        for (let i = seed.s; i < seed.s + seed.n; i++) {
            let c = null;
            for (const map of path) {
                if (c === null) {
                    c = mapper(maps[map], i);
                } else {
                    c = mapper(maps[map], c);
                }
            }
            lowest = Math.min(lowest, c)
        }
    }

    parentPort.postMessage({ low: lowest, no });
})

function mapper(map, v) {
    for (const range of map) {
        if (v < range.src) break;
        if (v >= range.src) {
            if (v < range.src + range.n) {
                return range.dest + v - range.src;
            }
        }
    }

    return v;
}
