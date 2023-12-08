import { getInput } from "../../utils/input.mjs";

const input = await getInput();

const DIRECTIONS = {
    U: [0, -1],
    R: [1, 0],
    D: [0, 1],
    L: [-1, 0],
}

const PATH = [];
const grid = [];
let start;
let end;
let a = 97 // 'a'.charChodeAt(0);

for (const line of input.lines()) {
    const y = grid.length;
    grid.push(line.split('').map((c, x) => c === 'S' ? (start = `${x},${y}`, 0) : c === 'E' ? (end = `${x},${y}`, 25) : c.charCodeAt(0) - a));
}

const visited = new Set([start]);
const pending = [{ v: start, depth: 0 }];
let currNode;

while (currNode = pending.shift()) {
    if (currNode.v === end) {
        console.log(currNode.depth);
        break;
    }
    const [x, y] = currNode.v.split(',');

    for (const dir of Object.values(DIRECTIONS)) {
        let k2 = [+x + dir[0], +y + dir[1]]
        const n = grid[k2[1]]?.[k2[0]];
        if (n >= 0 && n - grid[y][x] < 2) {
            const step = k2.join(',');
            if (!visited.has(step)) {
                pending.push({ v: step, depth: currNode.depth + 1 });
                visited.add(step);
            }
        }
    }
}
