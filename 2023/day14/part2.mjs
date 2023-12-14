import { getExampleInput, getInput } from '../../utils/index.mjs';
import memoize from 'memoize';
import { tilt, getLoad } from './common.mjs';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    let grid = [];
    for (const line of input.lines()) {
        grid.push(line);
    }

    const CYCLES = 1_000_000_000;
    grid = tiltCycle(grid, CYCLES);

    console.log('Total:', getLoad(grid));
}

function tiltCycle(grid, cycles) {
    const cache = new Map();
    const _tilt = memoize(tilt, {
        cacheKey: args => args.join(','),
        cache,
    });
    let loopStart, firstLoopGrid;
    let limit = cycles;
    for (let c = 0; c < limit; c++) {
        grid = _tilt(grid.slice(), 'N');
        grid = _tilt(grid.slice(), 'W');
        grid = _tilt(grid.slice(), 'S');

        let cacheSize = cache.size;
        grid = _tilt(grid.slice(), 'E');

        // Means the result was fetched from cache, and we've entered the loop
        if (cache.size === cacheSize) {
            loopStart ??= c;
            if (!firstLoopGrid) {
                firstLoopGrid = grid;
            } else if (grid === firstLoopGrid) {
                const cycle = c - loopStart;
                const start = loopStart - cycle;
                limit = (cycles - start) % cycle + c;
            }
        }
    }
    return grid;
}

main();
