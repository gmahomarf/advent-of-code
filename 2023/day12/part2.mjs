import { getExampleInput, getInput } from '../../utils/index.mjs';
import { possibilities, possibilitiesDebug } from './solution.mjs';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    let total = 0;
    for (const line of input.lines()) {
        const [_springs, _seqs] = line.split(' ');

        const springs = (_springs + '?').repeat(5).slice(0, -1);
        const _groups = (_seqs + ',').repeat(5).slice(0, -1);
        const groups = _groups.split(',').map(Number);
        const possibles = possibilities(springs.split(''), groups);
        // const possibles = possibilitiesDebug(springs.split(''), groups);
        // console.log(springs, _groups, '<=>', possibles);
        // console.log('');
        total += possibles;
    }

    console.log('Total:', total);
}

main();
