import { getInput } from '../../utils/index';

const input = await getInput();

const forest = [];

for (const line of input.lines()) {
    forest.push(line.split(''));
}

let lim = forest.length - 1;
let vTrees = lim * 4;

for (let i = 1; i < lim; i++) {
    for (let j = 1; j < lim; j++) {
        (u(forest, i, j) || d(forest, i, j) || l(forest, i, j) || r(forest, i, j)) && vTrees++;
    }
}

console.log(vTrees);

function u(a, x, y) {
    return check(a, x, y, 0, -1);
}

function d(a, x, y) {
    return check(a, x, y, 0, 1);
}

function l(a, x, y) {
    return check(a, x, y, -1, 0);
}

function r(a, x, y) {
    return check(a, x, y, 1, 0);
}

function check(a, x, y, dx, dy) {
    let t = +a[x][y];
    for (let i = x + dx, j = y + dy; i >= 0 && i <= lim && j >= 0 && j <= lim; i += dx, j += dy) {
        if (+a[i][j] >= t) return 0;
    }

    return 1;
}
