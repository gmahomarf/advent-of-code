import { createReadStream } from 'node:fs';
import readline from 'node:readline';

// const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const KEY = 811589153n;
const ROUNDS = 10;

async function run() {
    const numbers = [];
    const order = [];
    for await (const line of input) {
        const number = Object(BigInt(line) * KEY);
        numbers.push(number);
        order.push(number);
    }

    let z;
    for (let i = 0; i < ROUNDS; i++)
        for (const number of order) {
            const idx = BigInt(numbers.indexOf(number));
            const v = number.valueOf();
            if (v === 0n) {
                z ||= number;
                continue;
            }

            const newPos = idx + v;
            let newIdx;
            if (newPos <= 0n) {
                newIdx = (BigInt(numbers.length) + newPos - 1n) % BigInt(numbers.length);
            } else {
                newIdx = newPos % (BigInt(numbers.length) - 1n);
            }
            numbers
                .splice(Number(idx), 1);
            numbers
                .splice(Number(newIdx), 0, number);
        }

    console.log(numbers);
    const iz = numbers.indexOf(z);
    const oth = numbers[(iz + 1000) % numbers.length].valueOf();
    const tth = numbers[(iz + 2000) % numbers.length].valueOf();
    const thth = numbers[(iz + 3000) % numbers.length].valueOf();
    console.log('  iz:', iz)
    console.log('1000:', oth)
    console.log('2000:', tth)
    console.log('3000:', thth)
    console.log(' sum:', oth + tth + thth)
}

await run();
