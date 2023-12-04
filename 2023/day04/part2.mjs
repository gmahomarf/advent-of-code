import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const input = createInterface(createReadStream('input.txt', 'utf8'));

let re = /\d+/g;
const counts = {};
for await (const line of input) {
    const [card, winning, mine] = line.split(/: | \| /);
    const cardNo = Number(card.slice(5));
    const winners = {};
    counts[cardNo] ? counts[cardNo]++ : counts[cardNo] = 1;

    let n;
    while (n = re.exec(winning)) {
        winners[n] = 1;
    }

    let points = 0;
    while (n = re.exec(mine)) {
        if (winners[n]) {
            counts[cardNo + ++points] ??= 0;
            counts[cardNo + points] += counts[cardNo];
        }
    }
}

console.log(Object.values(counts).reduce((a, b) => a + b));
