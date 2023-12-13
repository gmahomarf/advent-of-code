import { getInput } from '../../utils/index.mjs';

const input = await getInput();

let sum = 0;
let re = /\d+/g;
for (const line of input.lines()) {
    const [, winning, mine] = line.split(/: | \| /);
    const winners = {};

    let n;
    while (n = re.exec(winning)) {
        winners[n] = 1;
    }

    let points = 0;
    while (n = re.exec(mine)) {
        if (winners[n]) {
            points ? points <<= 1 : points = 1;
        }
    }

    sum += points;
}

console.log(sum);
