import { getExampleInput, getInput } from '../../utils/index';

// const input = await getExampleInput();
const input = await getInput();

let nice = 0;
for (const line of input.lines()) {
    if (
        !/([a-z]{2}).*\1/.test(line)
        || !/([a-z]).\1/.test(line)
    ) {
        continue;
    }
    nice++;
}

console.log(nice);
