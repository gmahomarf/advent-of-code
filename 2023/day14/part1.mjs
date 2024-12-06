import { getExampleInput, getInput } from '../../utils/index';
import { getLoad, tilt } from './common.mjs';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    let grid = [];
    for (const line of input.lines()) {
        grid.push(line);
    }

    grid = tilt(grid.slice(), 'N');

    console.log('Total:', getLoad(grid));
}

main();
