import { readFile } from "node:fs/promises";

const input = await readFile("input.txt", "utf-8");

let sum = 0;

for (const line of input.split('\n')) {
    const [, plays] = line.split(': ');
    const blocks = {
        red: 0,
        green: 0,
        blue: 0,
    };

    for (const play of plays.split('; ')) {
        for (const block of play.split(', ')) {
            const [n, color] = block.split(' ');
            blocks[color] = Math.max(+n, blocks[color])
        }
    }

    sum += blocks.red * blocks.green * blocks.blue;
}

console.log(sum);
