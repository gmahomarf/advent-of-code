import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

// const input = await readFile('input.txt', 'utf8');
const input = await readFile('input-ex.txt', 'utf8');

const ORDER = [
    [
        ['#', '#', '#', '#'],
    ],

    [
        [' ', '#', ' '],
        ['#', '#', '#'],
        [' ', '#', ' '],
    ],

    [
        [' ', ' ', '#'],
        [' ', ' ', '#'],
        ['#', '#', '#'],
    ],

    [
        ['#'],
        ['#'],
        ['#'],
        ['#'],
    ],

    [
        ['##'],
        ['##'],
    ],
]
const WIDTH = 7;
let floor = 0;
for await (const direction of input) {
    console.log(direction)
}
