import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const input = createInterface(createReadStream('input.txt', 'utf-8'));

let nice = 0;
for await (const line of input) {
    if (
        !/([a-z]{2}).*\1/.test(line)
        || !/([a-z]).\1/.test(line)
    ) {
        continue;
    }
    nice++;
}

console.log(nice)
