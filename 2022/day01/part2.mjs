import { getInput } from "../../utils/input.mjs";

const input = await getInput();

let idx = -1;
let m = -1;
const elves = input.split('\n\n').map((e, i) => {
    let t = 0;
    for (const cal of e.split('\n')) {
        t += parseInt(cal);
    }
    if (m === -1 || t > m) {
        m = t;
        idx = i;
    }

    return t;
}).sort((a, b) => b - a);

const top3 = elves.slice(0, 3);
const sum = top3.reduce((a, b) => a + b)

console.log(`Elves ${top3} with ${sum} calories`)
