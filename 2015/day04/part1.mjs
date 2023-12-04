import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto';

const input = await readFile('input.txt', 'utf-8');

for (let i = 1; ; i++) {
    if (createHash('md5').update(`${input}${i}`).digest('hex').startsWith('00000')) {
        console.log(i);
        break;
    }
}
