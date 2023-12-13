import { getExampleInput, getInput } from '../../utils/index.mjs';

// const input = await getExampleInput();
const input = await getInput();

const you = {
    A: 1,
    B: 2,
    C: 3,
};

const me = {
    A: 1,
    B: 2,
    C: 3,
};

const moves = ['C', 'A', 'B', 'C', 'A'];

const move = {
    X: -1,
    Y: 0,
    Z: 1,
};

let score = 0;
for (const game of input.lines()) {
    const [y, m] = game.split(' ');
    const mine = moves[move[m] + you[y]];
    switch (me[mine] - you[y]) {
        case 0:
            score += 3 + me[mine];
            break;
        case 1:
        case -2:
            score += 6 + me[mine];
            break;
        default:
            score += me[mine];
    }
}

console.log(score);
