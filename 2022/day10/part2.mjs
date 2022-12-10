import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const START = 20;
const STEP = 40;
const LIMIT = 220;

let X = 1;
let i = 1;
let output = '';
for await (const line of input) {
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
