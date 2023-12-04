import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf-8');

let sum = 0;
const digits = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

const re = new RegExp(`(${Object.keys(digits).join('|')})`, 'g');

for (const line of input.split('\n')) {
    const numbers = line
        .replace(re, (v) => digits[v] + v.slice(1))
        .replace(re, (v) => digits[v])
        .split('')
        .map(Number)
        .filter(Number.isFinite);
    const f = numbers.shift();
    const l = numbers.pop() ?? f;
    const s = 10 * f + l;
    sum += s;
}

console.log(sum);
