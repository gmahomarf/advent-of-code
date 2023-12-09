import { getExampleInput, getInput } from "../../utils/input.mjs";

// const input = await getExampleInput();
const input = await getInput();

let sum = 0;

for (const line of input.lines()) {
    const history = [line.split(' ').map(Number)];

    let zeroes = false;
    while (!zeroes) {
        const prev = history.at(-1);
        const newA = [];
        zeroes = true;
        for (let i = 1; i < prev.length; i++) {
            let diff;
            newA.push(diff = prev[i] - prev[i - 1]);
            if (diff) {
                zeroes = false;
            }
        }
        history.push(newA);
    }

    sum += history.reduceRight((s, a) => a.at(-1) + s, 0)
}

console.log(sum);
