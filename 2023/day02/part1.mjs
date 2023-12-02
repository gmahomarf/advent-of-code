import { readFile } from "node:fs/promises";

const input = await readFile("input.txt", "utf-8");
const limits = {
    red: 12,
    green: 13,
    blue: 14,
}

let sum = 0;
main:
for (const line of input.split('\n')) {
    const [game, plays] = line.split(': ');
    const gameId = Number(game.slice(5));

    for (const play of plays.split('; ')) {
        for (const block of play.split(', ')) {
            const [n, color] = block.split(' ');

            if (+n > limits[color]) {
                continue main;
            }
        }
    }

    sum += gameId;
}

console.log(sum);
