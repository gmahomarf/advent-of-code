import { getExampleInput, getInput } from '../../utils/input.mjs';
import { possibilities, possibilitiesDebug } from './solution.mjs';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    let total = 0;
    for (const line of input.lines()) {
        const [springs, _seqs] = line.split(' ');

        const groups = _seqs.split(',').map(Number);
        const possibles = possibilities(springs.split(''), groups);
        // const possibles = possibilitiesDebug(springs.split(''), groups);
        // console.log(line, '<=>', possibles);
        // console.log('');
        total += possibles;
    }

    console.log('Total:', total);
}

main();
