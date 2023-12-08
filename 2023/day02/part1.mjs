import { getExampleInput, getInput } from '../../utils/input.mjs';

// const input = await getExampleInput();
const input = await getInput();

const limits = {
    red: 12,
    green: 13,
    blue: 14,
}

let sum = 0;
main:
for (const line of input.lines()) {
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
