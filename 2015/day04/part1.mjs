import { createHash } from 'node:crypto';
import { getExampleInput, getInput } from '../../utils/input.mjs';

// const input = await getExampleInput();
const input = await getInput();

for (let i = 1; ; i++) {
    if (createHash('md5').update(`${input}${i}`).digest('hex').startsWith('00000')) {
        console.log(i);
        break;
    }
}
