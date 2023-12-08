import { getExampleInput, getInput } from '../../utils/input.mjs';

// const input = await getExampleInput();
const input = await getInput();

const numbers = [];
const symbols = {};

let height = 0;
let width;
const re = /(?<s>[^.\d])|(?<n>\d+)/g;

for (const line of input.lines()) {
    let match;

    while (match = re.exec(line)) {
        if (match.groups.s) {
            symbols[`${match.index}x${height}`] = match[0]
        } else {
            numbers.push({
                y: height,
                s: match.index,
                e: match.index + match[0].length - 1,
                n: +match[0]
            })
        }
    }

    height++;
    width = line.length;
}

let sum = 0;
main:
for (const number of numbers) {
    let y = number.y - 1;

    if (y > 0) {
        for (let x = number.s - 1; x <= number.e + 1; x++) {
            if (x < 0 || x >= width) continue;
            if (symbols[`${x}x${y}`]) {
                sum += number.n;
                continue main;
            }
        }
    }

    y++;
    if (number.s > 0 && symbols[`${number.s - 1}x${y}`]) {
        sum += number.n;
        continue;
    }

    if (number.e < width - 1 && symbols[`${number.e + 1}x${y}`]) {
        sum += number.n;
        continue;
    }

    y++;
    if (y >= height) {
        continue;
    }

    for (let x = number.s - 1; x <= number.e + 1; x++) {
        if (x < 0 || x >= width) continue;
        if (symbols[`${x}x${y}`]) {
            sum += number.n;
            continue main;
        }
    }
}

console.log(sum)
