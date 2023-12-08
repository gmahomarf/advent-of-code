import { getInput } from "../../utils/input.mjs";

const input = await getInput();

const numbers = [];
const gears = {};

let height = 0;
let width;
const re = /(?<s>\*)|(?<n>\d+)/g;

for (const line of input.lines()) {
    let match;

    while (match = re.exec(line)) {
        if (match.groups.s) {
            gears[`${match.index}x${height}`] = []
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

for (const number of numbers) {
    let y = number.y - 1;
    if (y > 0) {
        for (let x = number.s - 1; x <= number.e + 1; x++) {
            if (x < 0 || x >= width) continue;
            if (gears[`${x}x${y}`]) {
                gears[`${x}x${y}`].push(number.n);
            }
        }
    }
    y++;
    if (number.s > 0 && gears[`${number.s - 1}x${y}`]) {
        gears[`${number.s - 1}x${y}`].push(number.n);
    }
    if (number.e < width - 1 && gears[`${number.e + 1}x${y}`]) {
        gears[`${number.e + 1}x${y}`].push(number.n);
    }
    y++;
    if (y >= height) continue;
    for (let x = number.s - 1; x <= number.e + 1; x++) {
        if (x < 0 || x >= width) continue;
        if (gears[`${x}x${y}`]) {
            gears[`${x}x${y}`].push(number.n);
        }
    }
}

console.log(Object.values(gears).filter(g => g.length === 2).reduce((s, g) => s + g[0] * g[1], 0))
