import { getInput } from '../../utils/index';

const input = await getInput();

const START = 20;
const STEP = 40;
const LIMIT = 220;

let X = 1;
let i = 1;
let sum = 0;
for (const line of input.lines()) {
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
        sum += X * i;
        // console.log(`${i}: ${X} => ${sum}`);
    }
}
