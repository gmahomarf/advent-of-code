import { getExampleInput, getInput } from '../../utils/input.mjs';
import { possibilitiesDebug, possibilitiesMemoized } from './solution.mjs';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    let total = 0;
    for (const line of input.lines()) {
        const [_springs, _seqs] = line.split(' ');

        const springs = (_springs + '?').repeat(5).slice(0, -1);
        const _groups = (_seqs + ',').repeat(5).slice(0, -1);
        const groups = _groups.split(',').map(Number);
        const possibles = possibilitiesMemoized(springs.split(''), groups);
        // const possibles = possibilitiesDebug(springs.split(''), groups, '');
        total += possibles;
        // console.log(springs, _groups, '<=>', possibles);
        // console.log('');
    }

    console.log('Total:', total);
}

main();
