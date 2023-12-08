import { getInput } from "../../utils/input.mjs";

const input = await getInput();

const START = 20;
const STEP = 40;
const LIMIT = 220;

let X = 1;
let i = 1;
let output = '';
for (const line of input.lines()) {
    const [cmd, arg] = line.split(' ');
    switch (cmd) {
        case 'addx':
            printPixel(i, X);
            i++;
            printPixel(i, X);
            X += +arg;
            i++;
            break;
        case 'noop':
            printPixel(i, X);
            i++;
            break;
    }
}

console.log(output);

function printPixel(i, X) {
    const pos = (i - 1) % STEP;
    if (X - 1 <= pos && pos <= X + 1) {
        output += '#'
    } else {
        output += '.';
    }
    if (pos === STEP - 1) {
        output += '\n';
    }
}
