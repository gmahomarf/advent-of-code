import { createReadStream } from 'node:fs';
import readline from 'node:readline';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const START = 20;
const STEP = 40;
const LIMIT = 220;

let X = 1;
let i = 1;
let sum = 0;
for await (const line of input) {
    const [cmd, arg] = line.split(' ');
    switch (cmd) {
        case 'addx':
            checkPrintSignal(i, X);
            i++;
            checkPrintSignal(i, X);
            X += +arg;
            i++;
            break;
        case 'noop':
            checkPrintSignal(i, X);
            i++;
            break;
    }
}

console.log(sum);

function checkPrintSignal(i, X) {
    if (i <= LIMIT && (i - START) % STEP === 0) {
        console.log(`${i}: ${X} => ${sum += X * i}`);
    }
}
