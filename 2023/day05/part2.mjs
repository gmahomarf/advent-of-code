import { getInput } from '../../utils/index';

const input = await getInput();

const seeds = [];
const maps = {};
const path = [];

let map;
for (const line of input.lines()) {
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
    map.sort((a, b) => a.src - b.src);
}

let lowest = Infinity;
for await (const seed of seedIterator(seeds)) {
    let c = null;
    for (const map of path) {
        if (c === null) {
            c = mapper(maps[map], seed);
        } else {
            c = mapper(maps[map], c);
        }
    }
    lowest = Math.min(lowest, c);
}

console.log(lowest);

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

function getSeeds(seeds) {
    const r = [];
    for (let i = 0; i < seeds.length; i += 2) {
        r.push({
            s: seeds[i],
            n: seeds[i + 1],
        });
    }

    return r;
}

function* seedIterator(seeds) {
    for (const seed of seeds) {
        for (let i = seed.s; i < seed.s + seed.n; i++) {
            yield i;
        }
    }
}
