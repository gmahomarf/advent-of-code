import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const input = createInterface(createReadStream("input.txt", "utf8"));

let sum = 0;
let re = /\d+/g;
for await (const line of input) {
    const [, winning, mine] = line.split(/: | \| /);
    const winners = {};

    let n;
    while ((n = re.exec(winning))) {
        winners[n] = 1;
    }

    let points = 0;
    while ((n = re.exec(mine))) {
        if (winners[n]) {
            points ? (points <<= 1) : (points = 1);
        }
    }

    sum += points;
}

console.log(sum);
